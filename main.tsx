import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileUp, Download, BookOpen, Menu, X, Check, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

const App = () => {
  const [file, setFile] = useState(null);
  const [logs, setLogs] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({
    sequence: false,
    state: false,
    requirements: false
  });

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      if (uploadedFile.name.endsWith('.arxml') || uploadedFile.name.endsWith('.xml')) {
        setFile(uploadedFile);
        setLogs([...logs, `📂 File uploaded: ${uploadedFile.name}`]);
        setShowAlert(false);
      } else {
        setShowAlert(true);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const uploadedFile = e.dataTransfer.files[0];
    if (uploadedFile && (uploadedFile.name.endsWith('.arxml') || uploadedFile.name.endsWith('.xml'))) {
      setFile(uploadedFile);
      setLogs([...logs, `📂 File uploaded: ${uploadedFile.name}`]);
      setShowAlert(false);
    } else {
      setShowAlert(true);
    }
  };

  const downloadRequirements = () => {
    if (!file) {
      setShowAlert(true);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const requirements = [['Requirement', 'Description'], ['REQ1', 'Sample Requirement']];
      const ws = XLSX.utils.aoa_to_sheet(requirements);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Requirements');
      XLSX.writeFile(wb, 'Requirements.xlsx');
      setLoading(false);
      setLogs([...logs, '📥 Requirements exported successfully']);
    }, 2000);
  };

  const handleCheckboxChange = (option) => {
    setSelectedOptions(prev => ({ ...prev, [option]: !prev[option] }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className="hover:bg-gray-100" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">BSW Configurator Tool</h1>
          </div>
          <Button variant="outline" className="hover:bg-gray-100">
            <BookOpen className="mr-2 h-4 w-4" /> Help
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        {sidebarOpen && (
          <aside className="w-80 bg-white border-r border-gray-200 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Activity Log</h2>
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2 max-h-[calc(100vh-12rem)] overflow-auto">
              {logs.map((log, index) => (
                <div key={index} className="flex items-center p-2 bg-green-50 rounded-lg text-sm text-green-700">
                  <Check className="h-4 w-4 mr-2" />
                  {log}
                </div>
              ))}
            </div>
          </aside>
        )}

        <main className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            {showAlert && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please upload a valid ARXML file before proceeding.
                </AlertDescription>
              </Alert>
            )}

            <Card className="bg-white shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload ARXML File</h2>
                
                <div 
                  className={`
                    relative rounded-lg border-2 border-dashed p-8 text-center
                    transition-all duration-200 ease-in-out
                    ${dragging 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-300 hover:border-gray-400'
                    }
                  `}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <FileUp className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-4 text-sm text-gray-600">
                    Drag and drop your ARXML file here, or
                  </p>
                  <input
                    type="file"
                    accept=".xml,.arxml"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="fileInput"
                  />
                  <label
                    htmlFor="fileInput"
                    className="mt-2 inline-block cursor-pointer text-sm font-medium text-green-600 hover:text-green-500"
                  >
                    browse to upload
                  </label>
                  {file && (
                    <div className="mt-4 text-sm text-gray-600">
                      Selected file: {file.name}
                    </div>
                  )}
                </div>

                <div className="mt-8 space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Export Options</h3>
                  <div className="space-y-3">
                    {Object.entries({
                      sequence: 'Generate Sequence Diagram',
                      state: 'Generate State Diagram',
                      requirements: 'Extract Requirements'
                    }).map(([key, label]) => (
                      <label key={key} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedOptions[key]}
                          onChange={() => handleCheckboxChange(key)}
                          className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button
                  className={`mt-6 w-full ${
                    loading 
                      ? 'bg-green-400' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                  onClick={downloadRequirements}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Processing...
                    </div>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" /> 
                      Export Selected Items
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="text-center text-sm text-gray-600">
          GMU * Luxoft
        </div>
      </footer>
    </div>
  );
};

export default App;