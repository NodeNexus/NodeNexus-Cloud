import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { User, Key, Moon, Sun, Monitor, Bell } from "lucide-react";

export function Settings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="text-text-secondary">Manage your account preferences and global configuration.</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general" className="gap-2"><User size={14} /> General</TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2"><Moon size={14} /> Appearance</TabsTrigger>
          <TabsTrigger value="api-keys" className="gap-2"><Key size={14} /> API Keys</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2"><Bell size={14} /> Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account details and email address.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">Display Name</label>
                <Input defaultValue="Admin User" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">Email Address</label>
                <Input defaultValue="admin@vnav.cloud" type="email" />
              </div>
            </CardContent>
            <CardFooter className="border-t border-border pt-4">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Theme Preferences</CardTitle>
              <CardDescription>Customize the look and feel of your console.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="border border-primary rounded-lg p-4 flex flex-col items-center gap-2 cursor-pointer bg-primary/5">
                  <Moon size={24} className="text-primary" />
                  <span className="font-medium">Dark (Active)</span>
                </div>
                <div className="border border-border hover:border-text-secondary rounded-lg p-4 flex flex-col items-center gap-2 cursor-pointer opacity-50">
                  <Sun size={24} />
                  <span className="font-medium">Light</span>
                </div>
                <div className="border border-border hover:border-text-secondary rounded-lg p-4 flex flex-col items-center gap-2 cursor-pointer opacity-50">
                  <Monitor size={24} />
                  <span className="font-medium">System</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api-keys" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>API Access</CardTitle>
              <CardDescription>Manage keys for programmatic access to VNAV Cloud.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-surface-active rounded-md border border-border flex justify-between items-center">
                <div>
                  <div className="font-medium">Default Development Key</div>
                  <div className="text-sm text-text-tertiary">Created 2 months ago</div>
                </div>
                <div className="font-mono text-sm bg-background px-3 py-1 rounded">
                  vnav_dev_******************
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-border pt-4">
              <Button variant="outline"><Key size={14} className="mr-2" /> Generate New Key</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Alert Preferences</CardTitle>
              <CardDescription>Configure how you receive system alerts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-text-secondary">
              Notification settings will be available in the next release.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
