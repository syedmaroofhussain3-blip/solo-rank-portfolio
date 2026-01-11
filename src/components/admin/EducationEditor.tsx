import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Save, Trash2, Loader2 } from 'lucide-react';

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean | null;
  description: string | null;
  display_order: number | null;
}

const EducationEditor = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newEducation, setNewEducation] = useState<Partial<Education> | null>(null);

  const { data: educations = [], isLoading } = useQuery({
    queryKey: ['education'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('education')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as Education[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Education> & { id: string }) => {
      const { error } = await supabase
        .from('education')
        .update(data)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] });
      toast.success('Education updated!');
      setEditingId(null);
    },
    onError: (error) => {
      toast.error('Failed to update: ' + error.message);
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<Education>) => {
      if (!data.institution || !data.degree) throw new Error('Institution and degree are required');
      const { error } = await supabase
        .from('education')
        .insert([{ institution: data.institution, degree: data.degree, field: data.field, location: data.location, start_date: data.start_date, end_date: data.end_date, is_current: data.is_current, description: data.description, display_order: educations.length + 1 }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] });
      toast.success('Education added!');
      setNewEducation(null);
    },
    onError: (error) => {
      toast.error('Failed to create: ' + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('education')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] });
      toast.success('Education deleted!');
    },
    onError: (error) => {
      toast.error('Failed to delete: ' + error.message);
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-bold">Manage Education</h2>
        <button
          onClick={() => setNewEducation({ institution: '', degree: '', is_current: false })}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Education
        </button>
      </div>

      {/* New Education Form */}
      {newEducation && (
        <EducationForm
          education={newEducation}
          onSave={(data) => createMutation.mutate(data)}
          onCancel={() => setNewEducation(null)}
          isLoading={createMutation.isPending}
        />
      )}

      {/* Existing Education */}
      <div className="space-y-4">
        {educations.map((edu) => (
          <div key={edu.id} className="card-glow rounded-xl p-6">
            {editingId === edu.id ? (
              <EducationForm
                education={edu}
                onSave={(data) => updateMutation.mutate({ id: edu.id, ...data })}
                onCancel={() => setEditingId(null)}
                isLoading={updateMutation.isPending}
              />
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold">{edu.institution}</h3>
                    {edu.is_current && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-primary font-medium">{edu.degree}</p>
                  {edu.field && <p className="text-muted-foreground text-sm">{edu.field}</p>}
                  {edu.location && <p className="text-muted-foreground text-sm">{edu.location}</p>}
                  {edu.description && <p className="text-sm mt-2">{edu.description}</p>}
                  <p className="text-xs text-muted-foreground mt-2">
                    {edu.start_date} - {edu.is_current ? 'Present' : edu.end_date}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingId(edu.id)}
                    className="px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this education entry?')) {
                        deleteMutation.mutate(edu.id);
                      }
                    }}
                    className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {educations.length === 0 && !newEducation && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No education entries yet. Add your educational background!</p>
        </div>
      )}
    </div>
  );
};

interface EducationFormProps {
  education: Partial<Education>;
  onSave: (data: Partial<Education>) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const EducationForm = ({ education, onSave, onCancel, isLoading }: EducationFormProps) => {
  const [formData, setFormData] = useState(education);

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Institution</label>
          <input
            type="text"
            value={formData.institution || ''}
            onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-primary focus:outline-none"
            placeholder="e.g., Integral University"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Degree</label>
          <input
            type="text"
            value={formData.degree || ''}
            onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-primary focus:outline-none"
            placeholder="e.g., BTech"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Field of Study</label>
          <input
            type="text"
            value={formData.field || ''}
            onChange={(e) => setFormData({ ...formData, field: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-primary focus:outline-none"
            placeholder="e.g., Computer Science"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Location</label>
          <input
            type="text"
            value={formData.location || ''}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-primary focus:outline-none"
            placeholder="e.g., Lucknow, UP"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Start Date</label>
          <input
            type="date"
            value={formData.start_date || ''}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">End Date</label>
          <input
            type="date"
            value={formData.end_date || ''}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            disabled={formData.is_current || false}
            className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-primary focus:outline-none disabled:opacity-50"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-primary focus:outline-none min-h-[80px]"
          placeholder="Additional details..."
        />
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={formData.is_current || false}
          onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })}
          className="w-4 h-4 rounded border-border"
        />
        <span className="text-sm">Currently studying here</span>
      </label>

      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <button
          onClick={() => onSave(formData)}
          disabled={isLoading || !formData.institution || !formData.degree}
          className="btn-primary flex items-center gap-2"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EducationEditor;
