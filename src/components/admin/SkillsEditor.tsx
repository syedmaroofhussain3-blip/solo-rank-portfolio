import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Save, Trash2, Loader2 } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number | null;
  display_order: number | null;
}

const CATEGORIES = ['Programming Languages', 'Web Development', 'Frameworks', 'Specialization'];

const SkillsEditor = () => {
  const queryClient = useQueryClient();
  const [newSkill, setNewSkill] = useState<Partial<Skill> | null>(null);

  const { data: skills = [], isLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as Skill[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Skill> & { id: string }) => {
      const { error } = await supabase
        .from('skills')
        .update(data)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      toast.success('Skill updated!');
    },
    onError: (error) => {
      toast.error('Failed to update: ' + error.message);
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<Skill>) => {
      if (!data.name || !data.category) throw new Error('Name and category are required');
      const { error } = await supabase
        .from('skills')
        .insert([{ name: data.name, category: data.category, proficiency: data.proficiency, display_order: skills.length + 1 }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      toast.success('Skill added!');
      setNewSkill(null);
    },
    onError: (error) => {
      toast.error('Failed to create: ' + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      toast.success('Skill deleted!');
    },
    onError: (error) => {
      toast.error('Failed to delete: ' + error.message);
    },
  });

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

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
        <h2 className="text-xl font-display font-bold">Manage Skills</h2>
        <button
          onClick={() => setNewSkill({ name: '', category: CATEGORIES[0], proficiency: 50 })}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Skill
        </button>
      </div>

      {/* New Skill Form */}
      {newSkill && (
        <div className="card-glow rounded-xl p-6 space-y-4">
          <h3 className="font-semibold">Add New Skill</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Skill Name</label>
              <input
                type="text"
                value={newSkill.name || ''}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-primary focus:outline-none"
                placeholder="e.g., JavaScript"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={newSkill.category || CATEGORIES[0]}
                onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-primary focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Proficiency: {newSkill.proficiency}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={newSkill.proficiency || 50}
                onChange={(e) => setNewSkill({ ...newSkill, proficiency: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => createMutation.mutate(newSkill)}
              disabled={createMutation.isPending || !newSkill.name}
              className="btn-primary flex items-center gap-2"
            >
              {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Add Skill
            </button>
            <button
              onClick={() => setNewSkill(null)}
              className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Skills by Category */}
      {CATEGORIES.map((category) => (
        <div key={category} className="card-glow rounded-xl p-6">
          <h3 className="font-display font-semibold text-primary mb-4">{category}</h3>
          <div className="space-y-3">
            {(groupedSkills[category] || []).map((skill) => (
              <SkillRow
                key={skill.id}
                skill={skill}
                onUpdate={(data) => updateMutation.mutate({ id: skill.id, ...data })}
                onDelete={() => deleteMutation.mutate(skill.id)}
                isUpdating={updateMutation.isPending}
              />
            ))}
            {(!groupedSkills[category] || groupedSkills[category].length === 0) && (
              <p className="text-muted-foreground text-sm">No skills in this category</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

interface SkillRowProps {
  skill: Skill;
  onUpdate: (data: Partial<Skill>) => void;
  onDelete: () => void;
  isUpdating: boolean;
}

const SkillRow = ({ skill, onUpdate, onDelete, isUpdating }: SkillRowProps) => {
  const [editing, setEditing] = useState(false);
  const [localSkill, setLocalSkill] = useState(skill);

  if (editing) {
    return (
      <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
        <input
          type="text"
          value={localSkill.name}
          onChange={(e) => setLocalSkill({ ...localSkill, name: e.target.value })}
          className="flex-1 px-3 py-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none"
        />
        <div className="flex items-center gap-2 flex-1">
          <span className="text-sm text-muted-foreground w-16">{localSkill.proficiency}%</span>
          <input
            type="range"
            min="0"
            max="100"
            value={localSkill.proficiency || 50}
            onChange={(e) => setLocalSkill({ ...localSkill, proficiency: parseInt(e.target.value) })}
            className="flex-1"
          />
        </div>
        <button
          onClick={() => {
            onUpdate(localSkill);
            setEditing(false);
          }}
          className="p-2 rounded-lg bg-primary text-primary-foreground"
        >
          <Save className="w-4 h-4" />
        </button>
        <button
          onClick={() => setEditing(false)}
          className="p-2 rounded-lg bg-muted hover:bg-muted/80"
        >
          ×
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
      <span className="flex-1 font-medium">{skill.name}</span>
      <div className="flex items-center gap-2 flex-1">
        <span className="text-sm text-muted-foreground w-16">LV. {Math.round((skill.proficiency || 0) / 10)}</span>
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent"
            style={{ width: `${skill.proficiency}%` }}
          />
        </div>
      </div>
      <button
        onClick={() => setEditing(true)}
        className="px-3 py-1 rounded-lg bg-muted hover:bg-muted/80 text-sm"
      >
        Edit
      </button>
      <button
        onClick={() => {
          if (confirm('Delete this skill?')) onDelete();
        }}
        className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

export default SkillsEditor;
