import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Save, Trash2, Loader2 } from 'lucide-react';

interface Experience {
  id: string;
  company: string;
  position: string;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean | null;
  description: string | null;
  display_order: number | null;
}

const ExperienceEditor = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newExperience, setNewExperience] = useState<Partial<Experience> | null>(null);

  const { data: experiences = [], isLoading } = useQuery({
    queryKey: ['experience'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('experience')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as Experience[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Experience> & { id: string }) => {
      const { error } = await supabase
        .from('experience')
        .update(data)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experience'] });
      toast.success('Experience updated!');
      setEditingId(null);
    },
    onError: (error) => {
      toast.error('Failed to update: ' + error.message);
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<Experience>) => {
      if (!data.company || !data.position) throw new Error('Company and position are required');
      const { error } = await supabase
        .from('experience')
        .insert([{ company: data.company, position: data.position, location: data.location, start_date: data.start_date, end_date: data.end_date, is_current: data.is_current, description: data.description, display_order: experiences.length + 1 }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experience'] });
      toast.success('Experience added!');
      setNewExperience(null);
    },
    onError: (error) => {
      toast.error('Failed to create: ' + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('experience')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experience'] });
      toast.success('Experience deleted!');
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
        <h2 className="text-xl font-display font-bold">Manage Experience</h2>
        <button
          onClick={() => setNewExperience({ company: '', position: '', is_current: false })}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Experience
        </button>
      </div>

      {/* New Experience Form */}
      {newExperience && (
        <ExperienceForm
          experience={newExperience}
          onSave={(data) => createMutation.mutate(data)}
          onCancel={() => setNewExperience(null)}
          isLoading={createMutation.isPending}
        />
      )}

      {/* Existing Experiences */}
      <div className="space-y-4">
        {experiences.map((exp) => (
          <div key={exp.id} className="card-glow rounded-xl p-6">
            {editingId === exp.id ? (
              <ExperienceForm
                experience={exp}
                onSave={(data) => updateMutation.mutate({ id: exp.id, ...data })}
                onCancel={() => setEditingId(null)}
                isLoading={updateMutation.isPending}
              />
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold">{exp.position}</h3>
                    {exp.is_current && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-primary font-medium">{exp.company}</p>
                  {exp.location && <p className="text-muted-foreground text-sm">{exp.location}</p>}
                  {exp.description && <p className="text-sm mt-2">{exp.description}</p>}
                  <p className="text-xs text-muted-foreground mt-2">
                    {exp.start_date} - {exp.is_current ? 'Present' : exp.end_date}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingId(exp.id)}
                    className="px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this experience?')) {
                        deleteMutation.mutate(exp.id);
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

      {experiences.length === 0 && !newExperience && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No experience entries yet. Add your work experience when ready!</p>
        </div>
      )}
    </div>
  );
};

interface ExperienceFormProps {
  experience: Partial<Experience>;
  onSave: (data: Partial<Experience>) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const ExperienceForm = ({ experience, onSave, onCancel, isLoading }: ExperienceFormProps) => {
  const [formData, setFormData] = useState(experience);

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Company</label>
          <input
            type="text"
            value={formData.company || ''}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-primary focus:outline-none"
            placeholder="Company name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Position</label>
          <input
            type="text"
            value={formData.position || ''}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-primary focus:outline-none"
            placeholder="Your role"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Location</label>
        <input
          type="text"
          value={formData.location || ''}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-primary focus:outline-none"
          placeholder="City, Country"
        />
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
          placeholder="What did you do?"
        />
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={formData.is_current || false}
          onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })}
          className="w-4 h-4 rounded border-border"
        />
        <span className="text-sm">I currently work here</span>
      </label>

      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <button
          onClick={() => onSave(formData)}
          disabled={isLoading || !formData.company || !formData.position}
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

export default ExperienceEditor;
