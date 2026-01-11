import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Save, Trash2, Loader2, ExternalLink, Github } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string | null;
  tech_stack: string[] | null;
  preview_url: string | null;
  github_url: string | null;
  image_url: string | null;
  is_featured: boolean | null;
  display_order: number | null;
}

const ProjectsEditor = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newProject, setNewProject] = useState<Partial<Project> | null>(null);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as Project[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Project> & { id: string }) => {
      const { error } = await supabase
        .from('projects')
        .update(data)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project updated!');
      setEditingId(null);
    },
    onError: (error) => {
      toast.error('Failed to update: ' + error.message);
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<Project>) => {
      if (!data.title) throw new Error('Title is required');
      const { error } = await supabase
        .from('projects')
        .insert([{ title: data.title, description: data.description, tech_stack: data.tech_stack, preview_url: data.preview_url, github_url: data.github_url, image_url: data.image_url, is_featured: data.is_featured, display_order: projects.length + 1 }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project created!');
      setNewProject(null);
    },
    onError: (error) => {
      toast.error('Failed to create: ' + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted!');
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
        <h2 className="text-xl font-display font-bold">Manage Projects</h2>
        <button
          onClick={() => setNewProject({ title: '', description: '', tech_stack: [], is_featured: false })}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Project
        </button>
      </div>

      {/* New Project Form */}
      {newProject && (
        <ProjectForm
          project={newProject}
          onChange={setNewProject}
          onSave={() => createMutation.mutate(newProject)}
          onCancel={() => setNewProject(null)}
          isLoading={createMutation.isPending}
        />
      )}

      {/* Existing Projects */}
      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="card-glow rounded-xl p-6">
            {editingId === project.id ? (
              <ProjectForm
                project={project}
                onChange={(updated) => updateMutation.mutate({ id: project.id, ...updated })}
                onSave={() => {}}
                onCancel={() => setEditingId(null)}
                isLoading={updateMutation.isPending}
                isEditing
              />
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{project.title}</h3>
                    {project.is_featured && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-solo-gold/20 text-solo-gold">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">{project.description}</p>
                  {project.tech_stack && project.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.tech_stack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-sm">
                    {project.preview_url && (
                      <a
                        href={project.preview_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Live Demo
                      </a>
                    )}
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                      >
                        <Github className="w-4 h-4" />
                        Source
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingId(project.id)}
                    className="px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this project?')) {
                        deleteMutation.mutate(project.id);
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

      {projects.length === 0 && !newProject && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No projects yet. Add your first project!</p>
        </div>
      )}
    </div>
  );
};

interface ProjectFormProps {
  project: Partial<Project>;
  onChange: (project: Partial<Project>) => void;
  onSave: () => void;
  onCancel: () => void;
  isLoading: boolean;
  isEditing?: boolean;
}

const ProjectForm = ({ project, onChange, onSave, onCancel, isLoading, isEditing }: ProjectFormProps) => {
  const [localProject, setLocalProject] = useState(project);
  const [techInput, setTechInput] = useState('');

  const handleSave = () => {
    if (isEditing) {
      onChange(localProject);
    } else {
      onChange(localProject);
      onSave();
    }
  };

  const addTech = () => {
    if (techInput.trim()) {
      setLocalProject({
        ...localProject,
        tech_stack: [...(localProject.tech_stack || []), techInput.trim()],
      });
      setTechInput('');
    }
  };

  const removeTech = (idx: number) => {
    setLocalProject({
      ...localProject,
      tech_stack: (localProject.tech_stack || []).filter((_, i) => i !== idx),
    });
  };

  return (
    <div className="card-glow rounded-xl p-6 space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            value={localProject.title || ''}
            onChange={(e) => setLocalProject({ ...localProject, title: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-primary focus:outline-none"
            placeholder="Project name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Image URL</label>
          <input
            type="text"
            value={localProject.image_url || ''}
            onChange={(e) => setLocalProject({ ...localProject, image_url: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-primary focus:outline-none"
            placeholder="https://..."
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          value={localProject.description || ''}
          onChange={(e) => setLocalProject({ ...localProject, description: e.target.value })}
          className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-primary focus:outline-none min-h-[80px]"
          placeholder="Describe your project..."
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Live Demo URL</label>
          <input
            type="url"
            value={localProject.preview_url || ''}
            onChange={(e) => setLocalProject({ ...localProject, preview_url: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-primary focus:outline-none"
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">GitHub URL</label>
          <input
            type="url"
            value={localProject.github_url || ''}
            onChange={(e) => setLocalProject({ ...localProject, github_url: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-primary focus:outline-none"
            placeholder="https://github.com/..."
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Tech Stack</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
            className="flex-1 px-4 py-2 rounded-lg bg-muted border border-border focus:border-primary focus:outline-none"
            placeholder="Add technology..."
          />
          <button
            type="button"
            onClick={addTech}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(localProject.tech_stack || []).map((tech, idx) => (
            <span
              key={idx}
              className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary flex items-center gap-2"
            >
              {tech}
              <button
                type="button"
                onClick={() => removeTech(idx)}
                className="hover:text-destructive"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={localProject.is_featured || false}
            onChange={(e) => setLocalProject({ ...localProject, is_featured: e.target.checked })}
            className="w-4 h-4 rounded border-border"
          />
          <span className="text-sm">Featured Project</span>
        </label>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <button
          type="button"
          onClick={handleSave}
          disabled={isLoading}
          className="btn-primary flex items-center gap-2"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ProjectsEditor;
