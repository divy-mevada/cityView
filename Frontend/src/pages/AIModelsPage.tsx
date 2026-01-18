import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { FileCode, Database, FileText, ChevronRight, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ModelFile {
    name: string;
    path: string;
    size: number;
    type: 'model' | 'code';
    content?: string;
}

export const AIModelsPage: React.FC = () => {
    const { user } = useAuth();
    const [files, setFiles] = useState<ModelFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState<ModelFile | null>(null);

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/settings/ai-files/');
            if (response.ok) {
                const data = await response.json();
                setFiles(data.files);
            }
        } catch (error) {
            console.error('Error fetching AI files:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const getIcon = (fileName: string) => {
        if (fileName.endsWith('.py')) return <FileCode className="w-5 h-5 text-blue-500" />;
        if (fileName.endsWith('.json')) return <Database className="w-5 h-5 text-yellow-500" />;
        if (fileName.endsWith('.pkl')) return <Database className="w-5 h-5 text-red-500" />;
        return <FileText className="w-5 h-5 text-gray-500" />;
    };

    return (
        <div className="flex min-h-screen" style={{ backgroundColor: '#D1E7F0' }}>
            <Sidebar userRole={(user?.role as 'citizen' | 'government') || 'government'} />

            <main className="flex-1 ml-64 p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">AI System Architecture</h1>
                    <p className="text-gray-600">Explore the underlying models and algorithms powering the city intelligence</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-150px)]">
                    {/* File List */}
                    <div className="card overflow-y-auto">
                        <h3 className="font-semibold mb-4 text-gray-700">Model Components</h3>
                        {loading ? (
                            <div className="text-center py-8">Loading system data...</div>
                        ) : (
                            <div className="space-y-2">
                                {files.map((file) => (
                                    <button
                                        key={file.path}
                                        onClick={() => setSelectedFile(file)}
                                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${selectedFile?.path === file.path
                                                ? 'bg-blue-50 border-blue-500 shadow-sm'
                                                : 'bg-white border-gray-200 hover:border-blue-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            {getIcon(file.name)}
                                            <div className="text-left overflow-hidden">
                                                <div className="font-medium text-sm truncate">{file.name}</div>
                                                <div className="text-xs text-gray-500">{formatSize(file.size)}</div>
                                            </div>
                                        </div>
                                        <ChevronRight size={16} className={`text-gray-400 ${selectedFile?.path === file.path ? 'text-blue-500' : ''}`} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* File Viewer */}
                    <div className="lg:col-span-2 card flex flex-col h-full bg-[#1e1e1e] text-white p-0 overflow-hidden">
                        {selectedFile ? (
                            <>
                                <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-[#252526]">
                                    <div className="flex items-center gap-2">
                                        {getIcon(selectedFile.name)}
                                        <span className="font-mono text-sm">{selectedFile.path}</span>
                                    </div>
                                    <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                                        {selectedFile.type === 'model' ? 'BINARY MODEL' : 'SOURCE CODE'}
                                    </span>
                                </div>
                                <div className="flex-1 overflow-auto p-4 font-mono text-sm">
                                    {selectedFile.type === 'model' ? (
                                        <div className="flex items-center justify-center h-full text-gray-400 flex-col gap-4">
                                            <Database size={48} />
                                            <p>Binary Model File (Serialized)</p>
                                            <p className="text-xs">Size: {formatSize(selectedFile.size)}</p>
                                        </div>
                                    ) : (
                                        <pre className="whitespace-pre-wrap text-blue-100">
                                            {selectedFile.content || 'Unable to read content'}
                                        </pre>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500 flex-col gap-4">
                                <FileCode size={48} />
                                <p>Select a file to view its source code or details</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};
