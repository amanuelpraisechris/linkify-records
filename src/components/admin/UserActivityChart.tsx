
import React, { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { UserActivity } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface UserActivityChartProps {
  activities: UserActivity[];
}

const UserActivityChart: React.FC<UserActivityChartProps> = ({ activities }) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  useEffect(() => {
    prepareChartData();
  }, [activities, timeRange]);

  const prepareChartData = () => {
    if (!activities.length) return;

    // Sort activities by timestamp
    const sortedActivities = [...activities].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    // Get date ranges based on selected time range
    const today = new Date();
    const dates: Record<string, Record<string, number>> = {};
    
    if (timeRange === 'daily') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        dates[dateStr] = {
          login: 0,
          logout: 0,
          password_change: 0,
          export_data: 0,
          import_data: 0,
          create_record: 0,
          update_record: 0,
          matching_review: 0,
        };
      }
    } else if (timeRange === 'weekly') {
      // Last 4 weeks
      for (let i = 3; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - (i * 7));
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        const weekLabel = `Week ${4-i}`;
        dates[weekLabel] = {
          login: 0,
          logout: 0,
          password_change: 0,
          export_data: 0,
          import_data: 0,
          create_record: 0,
          update_record: 0,
          matching_review: 0,
        };
      }
    } else {
      // Last 6 months
      for (let i = 5; i >= 0; i--) {
        const date = new Date(today);
        date.setMonth(date.getMonth() - i);
        const monthName = date.toLocaleString('default', { month: 'short' });
        dates[monthName] = {
          login: 0,
          logout: 0,
          password_change: 0,
          export_data: 0,
          import_data: 0,
          create_record: 0,
          update_record: 0,
          matching_review: 0,
        };
      }
    }

    // Count activities
    sortedActivities.forEach(activity => {
      const activityDate = new Date(activity.timestamp);
      
      if (timeRange === 'daily') {
        const dateStr = activityDate.toISOString().split('T')[0];
        if (dates[dateStr] && dates[dateStr][activity.action] !== undefined) {
          dates[dateStr][activity.action]++;
        }
      } else if (timeRange === 'weekly') {
        const weekOfActivity = Math.floor((today.getTime() - activityDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
        if (weekOfActivity < 4) {
          const weekLabel = `Week ${4 - weekOfActivity}`;
          if (dates[weekLabel] && dates[weekLabel][activity.action] !== undefined) {
            dates[weekLabel][activity.action]++;
          }
        }
      } else {
        const monthName = activityDate.toLocaleString('default', { month: 'short' });
        if (dates[monthName] && dates[monthName][activity.action] !== undefined) {
          dates[monthName][activity.action]++;
        }
      }
    });

    // Convert to chart data format
    const data = Object.entries(dates).map(([date, actions]) => ({
      date,
      ...actions,
      total: Object.values(actions).reduce((sum, count) => sum + count, 0)
    }));

    setChartData(data);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Tabs defaultValue={timeRange} onValueChange={(value) => setTimeRange(value as any)}>
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Tabs defaultValue="bar">
        <TabsList>
          <TabsTrigger value="bar">Bar Chart</TabsTrigger>
          <TabsTrigger value="line">Line Chart</TabsTrigger>
        </TabsList>

        <TabsContent value="bar" className="pt-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="login" fill="#4ade80" name="Login" />
              <Bar dataKey="password_change" fill="#facc15" name="Password Change" />
              <Bar dataKey="export_data" fill="#a855f7" name="Data Export" />
              <Bar dataKey="import_data" fill="#3b82f6" name="Data Import" />
              <Bar dataKey="create_record" fill="#ec4899" name="Record Creation" />
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="line" className="pt-4">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#8884d8" name="Total Activity" strokeWidth={2} />
              <Line type="monotone" dataKey="login" stroke="#4ade80" name="Login" />
              <Line type="monotone" dataKey="password_change" stroke="#facc15" name="Password Change" />
              <Line type="monotone" dataKey="export_data" stroke="#a855f7" name="Data Export" />
              <Line type="monotone" dataKey="import_data" stroke="#3b82f6" name="Data Import" />
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserActivityChart;
