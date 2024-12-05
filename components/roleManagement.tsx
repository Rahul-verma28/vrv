"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Input } from "./ui/input";
import { PlusIcon } from 'lucide-react';
import { RoleDialog } from "./roleDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const availablePermissions = ["create", "read", "update", "delete"] as const;
type Permission = (typeof availablePermissions)[number];

interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

// Mock data
const initialRoles: Role[] = [
  { id: 1, name: "Admin", permissions: ["create", "read", "update", "delete"] },
  { id: 2, name: "Editor", permissions: ["read", "update"] },
  { id: 3, name: "Viewer", permissions: ["read"] },
];

export function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [permissionFilter, setPermissionFilter] = useState("All");

  const filteredRoles = roles.filter((role) => {
    const matchesSearch = role.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesPermission =
      permissionFilter === "All" || role.permissions.includes(permissionFilter as Permission);
    return matchesSearch && matchesPermission;
  });

  const handleAddRole = (newRole: Omit<Role, "id">) => {
    setRoles([...roles, { ...newRole, id: roles.length + 1 }]);
  };

  const handleEditRole = (editedRole: Role) => {
    setRoles(
      roles.map((role) => (role.id === editedRole.id ? editedRole : role))
    );
  };

  const handleDeleteRole = (roleId: number) => {
    setRoles(roles.filter((role) => role.id !== roleId));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center space-x-4">
        <div className="flex justify-between items-center space-x-2 md:space-x-4">
          <Input
            className="max-w-lg dark:text-white"
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={permissionFilter} onValueChange={setPermissionFilter}>
            <SelectTrigger className="w-[80px] md:w-[300px]">
              <SelectValue placeholder="Filter by permission" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Permissions</SelectItem>
              <SelectItem value="create">Create</SelectItem>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="update">Update</SelectItem>
              <SelectItem value="delete">Delete</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <PlusIcon className="mr-2 h-4 w-4" /> Add Role
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Role Name</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRoles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-red-500">
                No data found
              </TableCell>
            </TableRow>
          ) : (
            filteredRoles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>{role.name}</TableCell>
                <TableCell>{role.permissions.join(", ")}</TableCell>
                <TableCell className="flex">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    onClick={() => {
                      setEditingRole(role);
                      setIsDialogOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          remove your data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteRole(role.id)}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <RoleDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingRole(null);
        }}
        onSave={(role: Omit<Role, "id">) => {
          if (editingRole) {
            handleEditRole({ ...role, id: editingRole.id });
          } else {
            handleAddRole(role);
          }
          setIsDialogOpen(false);
          setEditingRole(null);
        }}
        role={editingRole}
      />
    </div>
  );
}

