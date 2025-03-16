import { useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileDown } from 'lucide-react';
import { Navbar } from '@/components/navbar';

const Reports = () => {
  const [progress, setProgress] = useState(0);

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-semibold mb-5">Reports</h1>

        <Tabs defaultValue="data-quality" className="w-full">
          <TabsList>
            <TabsTrigger value="data-quality">Data Quality</TabsTrigger>
            <TabsTrigger value="usage-analytics">Usage Analytics</TabsTrigger>
            <TabsTrigger value="custom-reports">Custom Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="data-quality">
            <Card>
              <CardHeader>
                <CardTitle>Data Quality Score</CardTitle>
                <CardDescription>Overall data quality based on completeness and accuracy.</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={progress} className="mb-4" />
                <p className="text-sm text-muted-foreground">
                  Current Score: {progress}%
                </p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => setProgress(progress < 100 ? progress + 10 : 0)}>
                  Update Score
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="usage-analytics">
            <Card>
              <CardHeader>
                <CardTitle>User Engagement</CardTitle>
                <CardDescription>Metrics on user activity and feature adoption.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Detailed usage analytics will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="custom-reports">
            <Card>
              <CardHeader>
                <CardTitle>Generate Custom Report</CardTitle>
                <CardDescription>Create a report based on specific criteria.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Configure and download custom reports.</p>
              </CardContent>
              <CardFooter>
                <Button>
                  <FileDown className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Reports;
