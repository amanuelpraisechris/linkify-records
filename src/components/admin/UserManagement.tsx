import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  Users, 
  UserPlus, 
  Activity, 
  UserCheck, 
  UserX, 
  Download, 
  Upload,
  Key,
  User as UserIcon,
  Settings,
  Lock,
  Search,
  Shield
} from 'lucide-react';
import { User, UserActivity, UserStats } from '@/types';
import { mockUsers, mockUserActivities } from '@/utils/mockData';
import UserActivityChart from './UserActivityChart';

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    pendingUsers: 0,
    recentActivities: {
      passwordChanges: 0,
      dataExports: 0,
      dataImports: 0,
      recordCreations: 0,
      matchingReviews: 0
    }
  });
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    fullName: '',
    role: 'user',
  });

  useEffect(() => {
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
    setActivities(mockUserActivities);

    const stats: UserStats = {
      totalUsers: mockUsers.length,
      activeUsers: mockUsers.filter(user => user.status === 'active').length,
      pendingUsers: mockUsers.filter(user => user.status === 'pending').length,
      recentActivities: {
        passwordChanges: mockUserActivities.filter(a => a.action === 'password_change').length,
        dataExports: mockUserActivities.filter(a => a.action === 'export_data').length,
        dataImports: mockUserActivities.filter(a => a.action === 'import_data').length,
        recordCreations: mockUserActivities.filter(a => a.action === 'create_record').length,
        matchingReviews: mockUserActivities.filter(a => a.action === 'matching_review').length,
      }
    };
    setUserStats(stats);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(
        users.filter(user => 
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, users]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAddUser = () => {
    if (!newUser.username || !newUser.email || !newUser.fullName) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const newUserObject: User = {
      id: `user_${Date.now()}`,
      username: newUser.username,
      email: newUser.email,
      fullName: newUser.fullName,
      role: newUser.role as 'admin' | 'manager' | 'user' | 'pending',
      status: 'pending',
      createdAt: new Date().toISOString(),
      permissions: [],
      activityLog: []
    };

    setUsers([...users, newUserObject]);
    setFilteredUsers([...users, newUserObject]);
    setShowAddUserDialog(false);
    setNewUser({
      username: '',
      email: '',
      fullName: '',
      role: 'user',
    });

    toast({
      title: 'User added',
      description: `User ${newUser.username} has been added and is pending approval`,
    });
  };

  const approveUser = (userId: string) => {
    const updatedUsers = users.map(user => 
      user.id === userId 
        ? { ...user, status: 'active' as const } 
        : user
    );
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    
    toast({
      title: 'User approved',
      description: 'User has been approved and can now log in',
    });
  };

  const deactivateUser = (userId: string) => {
    const updatedUsers = users.map(user => 
      user.id === userId 
        ? { ...user, status: 'inactive' as const } 
        : user
    );
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    
    toast({
      title: 'User deactivated',
      description: 'User has been deactivated',
    });
  };

  const activateUser = (userId: string) => {
    const updatedUsers = users.map(user => 
      user.id === userId 
        ? { ...user, status: 'active' as const } 
        : user
    );
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    
    toast({
      title: 'User activated',
      description: 'User has been activated',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-red-500">Inactive</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-500">Admin</Badge>;
      case 'manager':
        return <Badge className="bg-blue-500">Manager</Badge>;
      case 'user':
        return <Badge>User</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl flex items-center">
                <Users className="mr-2" /> User Management
              </CardTitle>
              <CardDescription>
                Manage users, permissions, and view activity statistics
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                      Enter the details of the new user. They will be pending approval until activated.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="username" className="text-right">
                        Username
                      </Label>
                      <Input
                        id="username"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="fullName" className="text-right">
                        Full Name
                      </Label>
                      <Input
                        id="fullName"
                        value={newUser.fullName}
                        onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="role" className="text-right">
                        Role
                      </Label>
                      <select
                        id="role"
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        className="col-span-3 p-2 border rounded-md"
                      >
                        <option value="user">User</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowAddUserDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddUser}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="users">
                <Users className="h-4 w-4 mr-2" /> 
                Users
              </TabsTrigger>
              <TabsTrigger value="pending">
                <UserCheck className="h-4 w-4 mr-2" /> 
                Pending Approval ({userStats.pendingUsers})
              </TabsTrigger>
              <TabsTrigger value="activity">
                <Activity className="h-4 w-4 mr-2" /> 
                Activity Log
              </TabsTrigger>
              <TabsTrigger value="stats">
                <Shield className="h-4 w-4 mr-2" /> 
                Statistics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    className="pl-10 w-[300px]"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  Showing {filteredUsers.length} of {users.length} users
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell>{user.fullName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {user.status === 'active' ? (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => deactivateUser(user.id)}
                              >
                                <UserX className="h-4 w-4 mr-1" />
                                Deactivate
                              </Button>
                            ) : user.status === 'inactive' ? (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => activateUser(user.id)}
                              >
                                <UserCheck className="h-4 w-4 mr-1" />
                                Activate
                              </Button>
                            ) : (
                              <Button 
                                size="sm" 
                                variant="default" 
                                onClick={() => approveUser(user.id)}
                              >
                                <UserCheck className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users
                      .filter(user => user.status === 'pending')
                      .map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.username}</TableCell>
                          <TableCell>{user.fullName}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{getRoleBadge(user.role)}</TableCell>
                          <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                onClick={() => approveUser(user.id)}
                              >
                                <UserCheck className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => deactivateUser(user.id)}
                              >
                                <UserX className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    {users.filter(user => user.status === 'pending').length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No pending users
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activities.map((activity) => {
                      const user = users.find(u => u.id === activity.userId);
                      return (
                        <TableRow key={activity.id}>
                          <TableCell className="font-medium">
                            {user ? user.username : 'Unknown'}
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              activity.action === 'login' ? 'bg-green-500' :
                              activity.action === 'logout' ? 'bg-gray-500' :
                              activity.action === 'password_change' ? 'bg-yellow-500' :
                              activity.action === 'export_data' ? 'bg-purple-500' :
                              activity.action === 'import_data' ? 'bg-blue-500' :
                              activity.action === 'create_record' ? 'bg-indigo-500' :
                              activity.action === 'update_record' ? 'bg-pink-500' :
                              'bg-gray-700'
                            }>
                              {activity.action.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(activity.timestamp).toLocaleString()}</TableCell>
                          <TableCell>{activity.details || '-'}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="stats" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">User Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Total Users:</span>
                        <span className="font-semibold">{userStats.totalUsers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Active Users:</span>
                        <span className="font-semibold">{userStats.activeUsers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Pending Users:</span>
                        <span className="font-semibold">{userStats.pendingUsers}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Password Changes:</span>
                        <span className="font-semibold">{userStats.recentActivities.passwordChanges}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Data Exports:</span>
                        <span className="font-semibold">{userStats.recentActivities.dataExports}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Data Imports:</span>
                        <span className="font-semibold">{userStats.recentActivities.dataImports}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Record Creations:</span>
                        <span className="font-semibold">{userStats.recentActivities.recordCreations}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Activity Trends</CardTitle>
                  <CardDescription>User activity over the last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <UserActivityChart activities={activities} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
