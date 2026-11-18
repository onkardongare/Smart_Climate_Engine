"use client";

import React, { useState, useEffect } from "react";
import { UploadCloud, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { climateApi } from "../lib/api";
import type { UploadedFile, RegionInfo } from "../lib/types";

interface DocumentIngestionProps {
  selectedRegion: string;
  regions: RegionInfo[];
}

export function DocumentIngestion({ selectedRegion, regions }: DocumentIngestionProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetRegion, setTargetRegion] = useState<string>(selectedRegion);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isLoadingList, setIsLoadingList] = useState<boolean>(true);

  useEffect(() => {
    setTargetRegion(selectedRegion);
  }, [selectedRegion]);

  const loadFiles = async () => {
    setIsLoadingList(true);
    try {
      const data = await climateApi.getFiles();
      setFiles(data);
    } catch (err: any) {
      console.warn("Using offline file cache:", err);
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setStatusMessage(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setStatusMessage({ type: "error", text: "Please select an environmental data file to upload." });
      return;
    }

    setIsUploading(true);
    setStatusMessage(null);

    try {
      await climateApi.uploadFile(selectedFile, targetRegion);
      setStatusMessage({
        type: "success",
        text: `Successfully uploaded and registered "${selectedFile.name}". Ingested into climate decision pipeline.`,
      });
      setSelectedFile(null);
      const fileInput = document.getElementById("file-upload-input") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      await loadFiles();
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: `Upload failed via Express Gateway: ${err.message}`,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from the repository?`)) return;

    try {
      await climateApi.deleteFile(id);
      setFiles((prev) => prev.filter((f) => f.id !== id));
      setStatusMessage({ type: "success", text: `File "${name}" removed.` });
    } catch (err: any) {
      setStatusMessage({ type: "error", text: `Failed to delete file: ${err.message}` });
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes === 0) return "0 KB";
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const getFormatBadge = (mime: string, name: string) => {
    const ext = name.split(".").pop()?.toUpperCase() || "FILE";
    return (
      <span className="px-2.5 py-1 rounded text-xs font-mono font-semibold bg-notion-hover text-notion-text border border-notion-border">
        {ext}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="view-intro">
        <div>
          <h1 className="page-title">Municipal documents</h1>
          <p className="page-deck">Index plans, budgets, sensor records and spatial files by municipality.</p>
        </div>
        <p className="register-count"><strong>{files.length}</strong> indexed documents</p>
      </div>

      {/* Real Upload Form */}
      <div className="workspace-panel space-y-5">
        <h2 className="text-base font-bold text-notion-text">Upload a file</h2>

        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* File Input */}
            <div>
              <label htmlFor="file-upload-input" className="block text-sm font-semibold text-notion-text mb-1.5">File</label>
              <input
                id="file-upload-input"
                aria-describedby="file-formats"
                type="file"
                accept=".pdf,.geojson,.json,.csv,.xlsx,.xls,.kml"
                onChange={handleFileChange}
                disabled={isUploading}
                className="w-full text-sm text-notion-text file:mr-3 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-bold file:bg-notion-hover file:text-emerald-500 hover:file:bg-notion-border bg-notion-bg border border-notion-border rounded-lg p-2 focus:outline-none cursor-pointer"
              />
              <p id="file-formats" className="text-xs text-notion-secondary mt-2">PDF, GeoJSON, JSON, CSV, XLSX, XLS or KML. Up to 25 MB.</p>
            </div>

            {/* Target Region Tag */}
            <div>
              <label htmlFor="file-region" className="block text-sm font-semibold text-notion-text mb-1.5">
                Municipality
              </label>
              <select id="file-region"
                value={targetRegion}
                onChange={(e) => setTargetRegion(e.target.value)}
                disabled={isUploading}
                className="w-full bg-notion-bg border border-notion-border rounded-lg px-3.5 py-2.5 text-sm text-notion-text focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {regions.map((r) => (
                  <option key={r.id} value={r.name}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="text-xs sm:text-sm text-notion-secondary">
              {selectedFile ? (
                <span>
                  Selected file: <strong className="text-notion-text">{selectedFile.name}</strong> ({formatFileSize(selectedFile.size)})
                </span>
              ) : (
                <span>No file selected.</span>
              )}
            </div>

            <button
              type="submit"
              disabled={isUploading || !selectedFile}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-lg text-sm flex items-center space-x-2 transition-colors cursor-pointer shadow-sm"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{isUploading ? "Uploading via Gateway..." : "Upload & Index Document"}</span>
            </button>
          </div>
        </form>

        {/* Status Alerts */}
        {statusMessage && (
          <div
            className={`p-3.5 rounded-lg text-sm flex items-center space-x-2.5 ${
              statusMessage.type === "success"
                ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                : "bg-red-500/10 text-red-600 border border-red-500/30"
            }`}
          >
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            )}
            <span className="leading-relaxed">{statusMessage.text}</span>
          </div>
        )}
      </div>

      {/* Uploaded Documents Table */}
      <div className="bg-notion-sidebar border border-notion-border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 sm:p-5 bg-notion-bg border-b border-notion-border flex items-center justify-between">
          <h2 className="text-base font-bold text-notion-text">
            Document register
          </h2>
          <button
            onClick={loadFiles}
            className="text-xs sm:text-sm text-notion-secondary hover:text-emerald-500 underline cursor-pointer"
          >
            Refresh List
          </button>
        </div>

        {isLoadingList ? (
          <div className="p-10 text-center text-sm text-notion-secondary">Loading document repository...</div>
        ) : files.length === 0 ? (
          <div className="p-10 text-center text-sm text-notion-secondary">
            No documents uploaded yet. Upload a municipal report or GeoJSON file above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-notion-bg text-notion-secondary text-xs border-b border-notion-border font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Document Name</th>
                  <th className="px-5 py-3.5">Format</th>
                  <th className="px-5 py-3.5">Size</th>
                  <th className="px-5 py-3.5">Municipality</th>
                  <th className="px-5 py-3.5">Parsed Content Summary</th>
                  <th className="px-5 py-3.5">Uploaded</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-notion-border text-notion-text">
                {files.map((file) => (
                  <tr key={file.id} className="hover:bg-notion-hover/50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-notion-text whitespace-nowrap">
                      {file.original_name}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {getFormatBadge(file.mime_type, file.original_name)}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs sm:text-sm text-notion-secondary whitespace-nowrap">
                      {formatFileSize(Number(file.size_bytes))}
                    </td>
                    <td className="px-5 py-3.5 text-notion-text whitespace-nowrap">
                      {file.region || "All Municipalities"}
                    </td>
                    <td className="px-5 py-3.5 text-notion-secondary max-w-sm leading-relaxed text-xs sm:text-sm">
                      {file.summary}
                    </td>
                    <td className="px-5 py-3.5 text-notion-secondary whitespace-nowrap font-mono text-xs">
                      {new Date(file.uploaded_at).toLocaleDateString([], {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(file.id, file.original_name)}
                        title="Remove file record"
                        className="p-1.5 rounded-lg text-notion-secondary hover:text-red-500 hover:bg-notion-hover transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="document-note">
        Spatial layers describe wards and drainage corridors. Sensor records capture rainfall, river levels and air quality. Plans and budgets document council guidelines and spending limits.
      </p>
    </div>
  );
}
