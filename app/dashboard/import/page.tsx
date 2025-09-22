'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Loader2,
  Download,
  Info,
  Zap,
  FileText
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';

interface SkoolMember {
  email: string;
  name?: string;
  username?: string;
  joined_date?: string;
  membership_type?: string;
  amount_paid?: number;
  referrer?: string; // Could contain tracking ID
}

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [members, setMembers] = useState<SkoolMember[]>([]);
  const [results, setResults] = useState<{
    total: number;
    attributed: number;
    newConversions: number;
    totalRevenue: number;
  } | null>(null);
  const [error, setError] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const csvFile = acceptedFiles[0];
    if (csvFile && csvFile.type === 'text/csv') {
      setFile(csvFile);
      setError('');
      parseCSV(csvFile);
    } else {
      setError('Please upload a CSV file');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
  });

  const parseCSV = (csvFile: File) => {
    setParsing(true);

    Papa.parse(csvFile, {
      header: true,
      complete: (results) => {
        // Map Skool CSV columns to our format
        const mappedMembers = results.data.map((row: any) => ({
          email: row['Email'] || row['email'] || '',
          name: row['Name'] || row['Full Name'] || row['name'] || '',
          username: row['Username'] || row['username'] || '',
          joined_date: row['Joined Date'] || row['Join Date'] || row['joined_at'] || '',
          membership_type: row['Plan'] || row['Membership'] || row['Type'] || 'paid',
          amount_paid: parseFloat(row['Amount'] || row['Price'] || row['Payment'] || '0'),
          referrer: row['Referrer'] || row['Source'] || row['UTM'] || ''
        })).filter((m: SkoolMember) => m.email); // Filter out empty rows

        setMembers(mappedMembers);
        setParsing(false);
      },
      error: (error) => {
        setError(`Failed to parse CSV: ${error.message}`);
        setParsing(false);
      }
    });
  };

  const processImport = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/import/csv', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        setResults({
          total: result.results.total,
          attributed: result.results.attributed || 0,
          newConversions: result.results.imported,
          totalRevenue: result.results.totalRevenue || 0
        });
      } else {
        setError(result.error || 'Import failed');
      }

    } catch (err: any) {
      setError(err.message || 'Import failed');
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csv = Papa.unparse([
      {
        Email: 'john@example.com',
        Name: 'John Doe',
        Username: 'johndoe',
        'Joined Date': '2024-01-15',
        Plan: 'Paid',
        Amount: '59',
        Referrer: 'https://skool.com/community?allumi_id=abc123'
      },
      {
        Email: 'jane@example.com',
        Name: 'Jane Smith',
        Username: 'janesmith',
        'Joined Date': '2024-01-16',
        Plan: 'Free',
        Amount: '0',
        Referrer: ''
      }
    ]);

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'skool-members-template.csv';
    a.click();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Import Skool Members</h1>
        <p className="text-muted-foreground mt-2">
          Upload your Skool member export to track conversions and attribute them to your content
        </p>
      </div>

      {/* Import Methods */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-accent/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Automated (Recommended)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Set up Zapier to automatically sync new Skool members
            </p>
            <Button variant="outline" className="w-full">
              <Zap className="w-4 h-4 mr-2" />
              Setup Zapier Integration
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5" />
              Manual CSV Import
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Export members from Skool and upload the CSV here
            </p>
            <Button variant="outline" onClick={downloadTemplate} className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download CSV Template
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* CSV Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload CSV File</CardTitle>
          <CardDescription>
            Export your member list from Skool&apos;s admin panel and upload it here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-accent bg-accent/10' : 'border-border hover:border-accent/50'}
            `}
          >
            <input {...getInputProps()} />
            {file ? (
              <div className="space-y-2">
                <FileSpreadsheet className="w-12 h-12 mx-auto text-green-500" />
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {members.length} members found
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                <p className="font-medium">
                  {isDragActive ? 'Drop your CSV here' : 'Drag & drop your CSV file here'}
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse
                </p>
              </div>
            )}
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {members.length > 0 && !results && (
            <div className="mt-6 space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Ready to import {members.length} members.
                  {members.filter(m => m.amount_paid > 0).length} paid members detected.
                </AlertDescription>
              </Alert>

              <Button
                onClick={processImport}
                disabled={uploading}
                className="w-full"
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing {members.length} members...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Start Import
                  </>
                )}
              </Button>
            </div>
          )}

          {results && (
            <div className="mt-6">
              <Alert className="border-green-500/50 bg-green-50 dark:bg-green-900/20">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium text-green-900 dark:text-green-100">
                      Import completed successfully!
                    </p>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Processed</p>
                        <p className="text-lg font-bold">{results.total}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Attributed</p>
                        <p className="text-lg font-bold">{results.attributed}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">New Conversions</p>
                        <p className="text-lg font-bold">{results.newConversions}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Revenue</p>
                        <p className="text-lg font-bold">
                          ${results.totalRevenue.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Export from Skool</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3">
            <Badge className="mt-1">1</Badge>
            <p className="text-sm">Go to your Skool community admin panel</p>
          </div>
          <div className="flex gap-3">
            <Badge className="mt-1">2</Badge>
            <p className="text-sm">Navigate to Members section</p>
          </div>
          <div className="flex gap-3">
            <Badge className="mt-1">3</Badge>
            <p className="text-sm">Click &quot;Export to CSV&quot; button</p>
          </div>
          <div className="flex gap-3">
            <Badge className="mt-1">4</Badge>
            <p className="text-sm">Upload the downloaded CSV file here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}