import { useState, useEffect } from "react";
import { LuUserCircle, LuUsers, LuPencil, LuCheck, LuX } from "react-icons/lu";
import { createListCollection,
  Group,
  Input,
  Button,
  Flex,
  Text,
  IconButton,
  Select } from "@chakra-ui/react";

import {
  DrawerActionTrigger,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";

import type { User } from "@/types";
interface Profile {
  name: string;
  about: string;
  locale: string;
}

type ControlMode = "userList" | "profile";



const localeCollection = createListCollection({
  items: [
    { value: "US", label: "United States" },
    { value: "ES", label: "Spain" },
    { value: "DE", label: "Germany" },
    { value: "FR", label: "France" },
    { value: "IT", label: "Italy" },
    { value: "UK", label: "United Kingdom" },
    { value: "NL", label: "Netherlands" },
    { value: "BE", label: "Belgium" },
    { value: "PT", label: "Portugal" },
    { value: "SE", label: "Sweden" },
    { value: "NO", label: "Norway" },
  ]
})

export const ControlPanel = () => {
  const [controlMode, setControlMode] = useState<ControlMode>("userList");
  const [users, setUsers] = useState<User[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/fixtures/users.json');
      const data = await response.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    fetch('/fixtures/profile.json')
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setEditedProfile(data);
      });
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  return (
    <DrawerRoot>
      <DrawerBackdrop />
      <DrawerTrigger asChild>
        <Group attached>
          <Button aria-label="Users" size="sm" onClick={() => setControlMode("userList")}>
            <LuUsers />
          </Button>
          <Button aria-label="Profile" size="sm" onClick={() => setControlMode("profile")}>
            <LuUserCircle />
          </Button>
        </Group>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            {(() => {
              switch (controlMode) {
                case "userList":
                  return "User List";
                case "profile":
                  return "Profile";
              }
            })()}
          </DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          {(() => {
            switch (controlMode) {
              case "userList":
                return (
                  <ul>
                    {users.map((user) => (
                      <li key={user.id}>{user.name}</li>
                    ))}
                  </ul>
                );
              case "profile":
                return (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2 rounded-lg border p-4">
                      <Flex justify="space-between" align="center" mb={2}>
                        <Flex align="center" gap={2}>
                          <LuUserCircle className="h-6 w-6" />
                          <Text fontWeight="semibold">Profile</Text>
                        </Flex>
                        {!isEditing ? (
                          <IconButton
                            aria-label="edit profile"
                            size="sm"
                            onClick={handleEdit}
                            data-testid="button-edit-profile"
                          ><LuPencil /></IconButton>
                        ) : (
                          <Flex gap={2}>
                            <IconButton
                              aria-label="Save changes"
                              size="sm"
                              colorScheme="green"
                              onClick={handleSave}
                            ><LuCheck /></IconButton>
                            <IconButton
                              aria-label="Cancel editing"
                              size="sm"
                              colorScheme="red"
                              onClick={handleCancel}
                            ><LuX /></IconButton>
                          </Flex>
                        )}
                      </Flex>

                      {profile && editedProfile && (
                        <Flex direction="column" gap={3}>
                          <Flex direction="column">
                            <Text fontSize="sm" fontWeight="medium">Name</Text>
                            {isEditing ? (
                              <Input
                                value={editedProfile.name}
                                onChange={(e) => setEditedProfile({
                                  ...editedProfile,
                                  name: e.target.value
                                })}
                                size="sm"
                                aria-label="name"
                              />
                            ) : (
                              <Text>{profile.name}</Text>
                            )}
                          </Flex>

                          <Flex direction="column">
                            <Text fontSize="sm" fontWeight="medium">About</Text>
                            {isEditing ? (
                              <Input
                                value={editedProfile.about}
                                onChange={(e) => setEditedProfile({
                                  ...editedProfile,
                                  about: e.target.value
                                })}
                                size="sm"
                                aria-label="about"
                              />
                            ) : (
                              <Text>{profile.about}</Text>
                            )}
                          </Flex>

                          <Flex direction="column">
                            <Text fontSize="sm" fontWeight="medium">Country</Text>
                            {editedProfile.locale}
                            {isEditing ? (
                              <SelectRoot
                                value={[editedProfile.locale]}
                                onValueChange={(e) => setEditedProfile({
                                  ...editedProfile,
                                  locale: e.value[0]
                                })}
                                size="sm"
                                collection={localeCollection}
                              >

                                <SelectTrigger>
                                  <SelectValueText placeholder="Select locale" />
                                </SelectTrigger>
                                <SelectContent>
                                  {localeCollection.items.map((locale) => (
                                    <SelectItem item={locale} key={locale.value}>
                                      {locale.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </SelectRoot>
                            ) : (
                              <Text>{profile.locale}</Text>
                            )}
                          </Flex>
                        </Flex>
                      )}
                    </div>
                  </div>
                );
            }
          })()}
        </DrawerBody>
        <DrawerCloseTrigger />
      </DrawerContent>
    </DrawerRoot>
  );
};
