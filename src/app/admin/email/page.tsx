'use client';

import { useState, useEffect } from 'react';
import { FaPlus, FaClock, FaEnvelope, FaEdit, FaTrash, FaUsers, FaPaperPlane } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  createdAt: string;
}

interface ScheduledEmail {
  id: string;
  templateId: string;
  scheduledFor: string;
  status: string;
}

export default function EmailManagement() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [scheduledEmails, setScheduledEmails] = useState<ScheduledEmail[]>([]);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [isSending, setIsSending] = useState(false);

  // Template Modal Felder
  const [templateName, setTemplateName] = useState('');
  const [templateSubject, setTemplateSubject] = useState('');
  const [templateContent, setTemplateContent] = useState('');

  // Schedule Modal Felder
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/email/templates');
        if (!response.ok) throw new Error('Fehler beim Laden der Templates');
        const data = await response.json();
        setTemplates(data);
      } catch (error) {
        console.error('Error fetching templates:', error);
        toast.error('Templates konnten nicht geladen werden');
      }
    };

    const fetchScheduledEmails = async () => {
      try {
        const response = await fetch('/api/email/scheduled');
        if (!response.ok) throw new Error('Fehler beim Laden der geplanten E-Mails');
        const data = await response.json();
        setScheduledEmails(data);
      } catch (error) {
        console.error('Error fetching scheduled emails:', error);
        toast.error('Geplante E-Mails konnten nicht geladen werden');
      }
    };

    const fetchSubscriberCount = async () => {
      try {
        const response = await fetch('/api/newsletter/subscribers/count');
        if (!response.ok) throw new Error('Fehler beim Laden der Abonnenten');
        const data = await response.json();
        setSubscriberCount(data.count);
      } catch (error) {
        console.error('Error fetching subscriber count:', error);
      }
    };

    fetchTemplates();
    fetchScheduledEmails();
    fetchSubscriberCount();
  }, []);

  const handleSendNow = async (template: EmailTemplate) => {
    if (!confirm(`Möchten Sie diese E-Mail wirklich an ${subscriberCount} Abonnenten senden?`)) return;

    setIsSending(true);
    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: template.id }),
      });

      if (!response.ok) throw new Error('Fehler beim Senden der E-Mail');
      
      const data = await response.json();
      toast.success(`E-Mail wird an ${subscriberCount} Abonnenten gesendet`);
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('E-Mail konnte nicht gesendet werden');
    } finally {
      setIsSending(false);
    }
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setTemplateName(template.name);
    setTemplateSubject(template.subject);
    setTemplateContent(template.content);
    setShowTemplateModal(true);
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      const response = await fetch(`/api/email/templates/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Fehler beim Löschen des Templates');

      setTemplates(prev => prev.filter(template => template.id !== id));
      toast.success('Template erfolgreich gelöscht');
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Template konnte nicht gelöscht werden');
    }
  };

  const handleSaveTemplate = async () => {
    try {
      const response = await fetch('/api/email/templates', {
        method: selectedTemplate ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedTemplate?.id,
          name: templateName,
          subject: templateSubject,
          content: templateContent,
        }),
      });

      if (!response.ok) throw new Error('Fehler beim Speichern des Templates');
      
      const data = await response.json();
      setTemplates(prev => {
        const newTemplates = [...prev];
        const index = newTemplates.findIndex(t => t.id === data.template.id);
        if (index >= 0) {
          newTemplates[index] = data.template;
        } else {
          newTemplates.push(data.template);
        }
        return newTemplates;
      });

      setShowTemplateModal(false);
      resetTemplateForm();
      toast.success('Template erfolgreich gespeichert');
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Template konnte nicht gespeichert werden');
    }
  };

  const handleScheduleEmail = async () => {
    try {
      const scheduledDateTime = `${scheduledDate}T${scheduledTime}:00`;
      const response = await fetch('/api/email/scheduled', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selectedTemplateId,
          scheduledFor: scheduledDateTime,
        }),
      });

      if (!response.ok) throw new Error('Fehler beim Planen der E-Mail');
      
      const data = await response.json();
      setScheduledEmails(prev => [...prev, data.scheduledEmail]);
      setShowScheduleModal(false);
      toast.success('E-Mail erfolgreich geplant');
    } catch (error) {
      console.error('Error scheduling email:', error);
      toast.error('E-Mail konnte nicht geplant werden');
    }
  };

  const handleDeleteScheduledEmail = async (id: string) => {
    try {
      const response = await fetch(`/api/email/scheduled/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Fehler beim Löschen der E-Mail');

      setScheduledEmails(prev => prev.filter(email => email.id !== id));
      toast.success('E-Mail erfolgreich gelöscht');
    } catch (error) {
      console.error('Error deleting scheduled email:', error);
      toast.error('E-Mail konnte nicht gelöscht werden');
    }
  };

  const resetTemplateForm = () => {
    setSelectedTemplate(null);
    setTemplateName('');
    setTemplateSubject('');
    setTemplateContent('');
  };

  const resetScheduleForm = () => {
    setSelectedTemplateId('');
    setScheduledDate('');
    setScheduledTime('');
  };

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <div className="flex justify-between items-center border-b border-gray-800 px-6 py-4">
        <h1 className="text-2xl font-bold text-white">E-Mail-Verwaltung</h1>
        <button
          onClick={() => setShowTemplateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FaPlus className="w-4 h-4" /> Template erstellen
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
        <div className="bg-[#1E293B] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Empfänger</h3>
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <FaUsers className="text-blue-400 w-6 h-6" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{subscriberCount}</p>
          <p className="text-gray-400 mt-2">Aktive Newsletter-Abonnenten</p>
        </div>

        <div className="bg-[#1E293B] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Templates</h3>
            <div className="p-3 bg-green-500/10 rounded-lg">
              <FaEnvelope className="text-green-400 w-6 h-6" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{templates.length}</p>
          <p className="text-gray-400 mt-2">Verfügbare E-Mail-Templates</p>
        </div>

        <div className="bg-[#1E293B] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Geplant</h3>
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <FaClock className="text-purple-400 w-6 h-6" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{scheduledEmails.length}</p>
          <p className="text-gray-400 mt-2">Geplante E-Mails</p>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-[#1E293B] rounded-xl border border-gray-800">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-6">E-Mail-Templates</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Betreff</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Erstellt am</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-medium">Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {templates.map((template) => (
                    <tr key={template.id} className="border-b border-gray-800 last:border-b-0">
                      <td className="py-4 px-4 text-white">{template.name}</td>
                      <td className="py-4 px-4 text-white">{template.subject}</td>
                      <td className="py-4 px-4 text-white">
                        {new Date(template.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleSendNow(template)}
                            className="p-2 hover:bg-blue-500/10 rounded-lg text-blue-400 hover:text-blue-300 transition-colors"
                            disabled={isSending}
                          >
                            <FaPaperPlane className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditTemplate(template)}
                            className="p-2 hover:bg-green-500/10 rounded-lg text-green-400 hover:text-green-300 transition-colors"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTemplate(template.id)}
                            className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 hover:text-red-300 transition-colors"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {templates.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-400">
                        Keine Templates vorhanden
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-[#1E293B] rounded-xl border border-gray-800 mt-6">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Geplante E-Mails</h2>
              <button
                onClick={() => setShowScheduleModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FaPlus className="w-4 h-4" /> E-Mail planen
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Template</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Geplant für</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-medium">Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduledEmails.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-400">
                        Keine geplanten E-Mails vorhanden
                      </td>
                    </tr>
                  ) : (
                    scheduledEmails.map((email) => (
                      <tr key={email.id} className="border-b border-gray-800 last:border-b-0">
                        <td className="py-4 px-4 text-white">
                          {templates.find((t) => t.id === email.templateId)?.name}
                        </td>
                        <td className="py-4 px-4 text-white">
                          {new Date(email.scheduledFor).toLocaleString()}
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400">
                            {email.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end">
                            <button
                              onClick={() => handleDeleteScheduledEmail(email.id)}
                              className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 hover:text-red-300 transition-colors"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1E293B] rounded-xl border border-gray-800 w-full max-w-2xl mx-4">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-6">
                {selectedTemplate ? 'Template bearbeiten' : 'Neues Template erstellen'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 mb-2">Name</label>
                  <input
                    type="text"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    className="w-full bg-[#0F172A] border border-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Betreff</label>
                  <input
                    type="text"
                    value={templateSubject}
                    onChange={(e) => setTemplateSubject(e.target.value)}
                    className="w-full bg-[#0F172A] border border-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Inhalt</label>
                  <textarea
                    value={templateContent}
                    onChange={(e) => setTemplateContent(e.target.value)}
                    rows={10}
                    className="w-full bg-[#0F172A] border border-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => {
                    setShowTemplateModal(false);
                    resetTemplateForm();
                  }}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleSaveTemplate}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Speichern
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1E293B] rounded-xl border border-gray-800 w-full max-w-md mx-4">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-6">E-Mail planen</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 mb-2">Template</label>
                  <select
                    value={selectedTemplateId}
                    onChange={(e) => setSelectedTemplateId(e.target.value)}
                    className="w-full bg-[#0F172A] border border-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Template auswählen</option>
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Datum</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full bg-[#0F172A] border border-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Uhrzeit</label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full bg-[#0F172A] border border-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => {
                    setShowScheduleModal(false);
                    resetScheduleForm();
                  }}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleScheduleEmail}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Planen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
