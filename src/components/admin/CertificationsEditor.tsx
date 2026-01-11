import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Save, Trash2, Loader2, ExternalLink } from 'lucide-react';

interface Certification {
  id: string;
  title: string;
  issuer: string;
  issue_date: string | null;
  expiry_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
  display_order: number | null;
}

const CertificationsEditor = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCert, setNewCert] = useState<Partial<Certification> | null>(null);

  const { data: certifications = [], isLoading } = useQuery({
    queryKey: ['certifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as Certification[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Certification> & { id: string }) => {
      const { error } = await supabase
        .from('certifications')
        .update(data)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
      toast.success('Certification updated!');
      setEditingId(null);
    },
    onError: (error) => {
      toast.error('Failed to update: ' + error.message);
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<Certification>) => {
      if (!data.title || !data.issuer) throw new Error('Title and issuer are required');
      const { error } = await supabase
        .from('certifications')
        .insert([{ title: data.title, issuer: data.issuer, issue_date: data.issue_date, expiry_date: data.expiry_date, credential_id: data.credential_id, credential_url: data.credential_url, display_order: certifications.length + 1 }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
      toast.success('Certification added!');
      setNewCert(null);
    },
    onError: (error) => {
      toast.error('Failed to create: ' + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('certifications')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
      toast.success('Certification deleted!');
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
        <h2 className="text-xl font-display font-bold">Manage Certifications</h2>
        <button
          onClick={() => setNewCert({ title: '', issuer: '' })}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Certification
        </button>
      </div>

      {/* New Certification Form */}
      {newCert && (
        <CertificationForm
          certification={newCert}
          onSave={(data) => createMutation.mutate(data)}
          onCancel={() => setNewCert(null)}
          isLoading={createMutation.isPending}
        />
      )}

      {/* Existing Certifications */}
      <div className="grid md:grid-cols-2 gap-4">
        {certifications.map((cert) => (
          <div key={cert.id} className="card-glow rounded-xl p-6">
            {editingId === cert.id ? (
              <CertificationForm
                certification={cert}
                onSave={(data) => updateMutation.mutate({ id: cert.id, ...data })}
                onCancel={() => setEditingId(null)}
                isLoading={updateMutation.isPending}
              />
            ) : (
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">{cert.title}</h3>
                  <p className="text-primary font-medium text-sm">{cert.issuer}</p>
                  {cert.issue_date && (
                    <p className="text-muted-foreground text-xs mt-2">
                      Issued: {cert.issue_date}
                      {cert.expiry_date && ` • Expires: ${cert.expiry_date}`}
                    </p>
                  )}
                  {cert.credential_id && (
                    <p className="text-muted-foreground text-xs">ID: {cert.credential_id}</p>
                  )}
                  {cert.credential_url && (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View Credential
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                  <button
                    onClick={() => setEditingId(cert.id)}
                    className="px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this certification?')) {
                        deleteMutation.mutate(cert.id);
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

      {certifications.length === 0 && !newCert && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No certifications yet. Add your achievements when ready!</p>
        </div>
      )}
    </div>
  );
};

interface CertificationFormProps {
  certification: Partial<Certification>;
  onSave: (data: Partial<Certification>) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const CertificationForm = ({ certification, onSave, onCancel, isLoading }: CertificationFormProps) => {
  const [formData, setFormData] = useState(certification);

  return (
    <div className="card-glow rounded-xl p-6 space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-primary focus:outline-none"
            placeholder="Certification name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Issuer</label>
          <input
            type="text"
            value={formData.issuer || ''}
            onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-primary focus:outline-none"
            placeholder="e.g., Google, AWS"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Issue Date</label>
          <input
            type="date"
            value={formData.issue_date || ''}
            onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Expiry Date (optional)</label>
          <input
            type="date"
            value={formData.expiry_date || ''}
            onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Credential ID (optional)</label>
          <input
            type="text"
            value={formData.credential_id || ''}
            onChange={(e) => setFormData({ ...formData, credential_id: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-primary focus:outline-none"
            placeholder="e.g., ABC123XYZ"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Credential URL (optional)</label>
          <input
            type="url"
            value={formData.credential_url || ''}
            onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-muted border border-border focus:border-primary focus:outline-none"
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <button
          onClick={() => onSave(formData)}
          disabled={isLoading || !formData.title || !formData.issuer}
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

export default CertificationsEditor;
