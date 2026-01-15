"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { TablePageLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import Button from "@/components/ui/button/Button";
import {
  HiOutlineSave,
  HiOutlinePaperAirplane,
  HiOutlineX,
  HiOutlineCode,
  HiOutlineTemplate,
  HiOutlineClipboardCopy,
} from "react-icons/hi";

interface Campaign {
  id: string;
  name: string;
  subject: string;
  body: string;
  status: string;
}

export default function EditCampaignPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'template'>('editor');

  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    body: "",
  });

  useEffect(() => {
    document.title = "Edit Email Campaign - HACKTOLIVE Academy";
    if (campaignId) {
      fetchCampaign();
    }
  }, [campaignId]);

  const fetchCampaign = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/newsletter/campaigns/${campaignId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch campaign');
      
      const result = await response.json();
      const campaign = result.data || result;
      
      setFormData({
        name: campaign.name,
        subject: campaign.subject,
        body: campaign.body,
      });
    } catch (error: any) {
      console.error('Error fetching campaign:', error);
      toast.error('Failed to load campaign', {
        description: 'Please try again',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (sendNow: boolean = false) => {
    if (!formData.name || !formData.subject || !formData.body) {
      toast.error('Missing required fields', {
        description: 'Please fill in all required fields',
      });
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/newsletter/campaigns/${campaignId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to update campaign");

      // If send now, trigger send
      if (sendNow) {
        const sendResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/newsletter/campaigns/${campaignId}/send`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!sendResponse.ok) throw new Error("Campaign updated but failed to send");

        toast.success('Campaign updated and sent!', {
          description: 'Campaign is being sent to subscribers',
        });
      } else {
        toast.success('Campaign updated successfully!');
      }

      router.push("/admin/newsletter/campaigns");
    } catch (error: any) {
      console.error("Error updating campaign:", error);
      toast.error('Failed to update campaign', {
        description: error.message || 'Please try again',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const emailTemplate = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background: #ffffff;
        border-radius: 8px;
        overflow: hidden;
      }
      .header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 30px;
        text-align: center;
        color: white;
      }
      .header h1 {
        margin: 0;
        font-size: 28px;
      }
      .content {
        padding: 30px;
      }
      .button {
        display: inline-block;
        background: #48bb78;
        color: white;
        padding: 12px 30px;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
        margin: 20px 0;
      }
      .footer {
        background: #f7fafc;
        padding: 20px;
        text-align: center;
        color: #718096;
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🔒 HackToLive Newsletter</h1>
      </div>
      <div class="content">
        <h2>Your Email Content Here</h2>
        <p>Write your newsletter content here...</p>
        
        <a href="#" class="button">Call to Action</a>
        
        <p>Best regards,<br><strong>The HackToLive Team</strong></p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} HackToLive. All rights reserved.</p>
        <p>You're receiving this email because you subscribed to our newsletter.</p>
      </div>
    </div>
  </body>
</html>`;

  const copyTemplate = () => {
    setFormData({ ...formData, body: emailTemplate });
    setActiveTab('editor');
    toast.success('Template copied!', {
      description: 'Template has been added to the editor',
    });
  };

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Edit Email Campaign" />
        <TablePageLoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle="Edit Email Campaign" />

      {/* Form Card */}
      <div className="rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        {/* Header */}
        <div className="border-b border-gray-200 p-3 sm:p-4 dark:border-white/5">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Campaign Details</h2>
          <p className="mt-0.5 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
            Update campaign information and content
          </p>
        </div>

        {/* Form */}
        <div className="p-3 sm:p-6 space-y-5">
          {/* Campaign Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Campaign Name <span className="text-error-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g., Monthly Security Update - January 2026"
              value={formData.name}
              onChange={handleChange}
              className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
              required
            />
          </div>

          {/* Email Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Email Subject <span className="text-error-500">*</span>
            </label>
            <input
              type="text"
              name="subject"
              placeholder="e.g., Your Monthly Cybersecurity Digest"
              value={formData.subject}
              onChange={handleChange}
              className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
              required
            />
          </div>

          {/* Email Body with Tabs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Email Body (HTML) <span className="text-error-500">*</span>
            </label>

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-3 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('editor')}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === 'editor'
                    ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                    : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <HiOutlineCode className="h-4 w-4" />
                  Edit HTML
                </div>
              </button>
              <button
                onClick={() => setActiveTab('template')}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === 'template'
                    ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                    : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <HiOutlineTemplate className="h-4 w-4" />
                  Template
                </div>
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'editor' ? (
              <div>
                <textarea
                  name="body"
                  placeholder="Enter your HTML email content..."
                  value={formData.body}
                  onChange={handleChange}
                  rows={20}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-mono text-gray-900 placeholder-gray-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
                  required
                />
              </div>
            ) : (
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  Copy this template to get started:
                </p>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700">
                  <pre className="text-xs text-gray-800 dark:text-gray-300 whitespace-pre overflow-x-auto">
                    <code>{emailTemplate}</code>
                  </pre>
                </div>
                <button
                  onClick={copyTemplate}
                  className="mt-3 h-9 inline-flex items-center justify-center gap-2 font-medium rounded-lg transition px-4 text-sm bg-brand-500 text-white hover:bg-brand-600"
                >
                  <HiOutlineClipboardCopy className="h-4 w-4" />
                  Use This Template
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => handleSubmit(false)}
              disabled={submitting}
              className="h-10 inline-flex items-center justify-center gap-2 font-medium rounded-lg transition px-5 text-sm bg-success-600 text-white hover:bg-success-700 shadow-lg shadow-success-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <HiOutlineSave className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
            <button
              onClick={() => handleSubmit(true)}
              disabled={submitting}
              className="h-10 inline-flex items-center justify-center gap-2 font-medium rounded-lg transition px-5 text-sm bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <HiOutlinePaperAirplane className="h-4 w-4" />
                  Save and Send Now
                </>
              )}
            </button>
            <button
              onClick={() => router.back()}
              disabled={submitting}
              className="h-10 inline-flex items-center justify-center gap-2 font-medium rounded-lg transition px-5 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <HiOutlineX className="h-4 w-4" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
