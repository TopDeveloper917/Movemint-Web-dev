"use client";
import DeleteIcon from "@/components/icons/delete-icon";
import EmailIcon from "@/components/icons/email-icon";
import TrashIcon from "@/components/icons/trash-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ChevronLeftIcon, ChevronRightIcon, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { auth } from "@/services/firebase";
import { listenToRoomsForUser, getUnreadMessageCount, getOtherUserName } from "@/services/firebaseRoom";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/userContext";

const messages = [
  {
    id: 1,
    name: "Jullu Jalal",
    status: "Accepted",
    time: "8:38 AM",
    starred: true,
  },
  {
    id: 2,
    name: "Minerva Barnett",
    status: "Read",
    time: "8:13 AM",
    starred: false,
  },
  {
    id: 3,
    name: "Peter Lewis",
    status: "New",
    time: "7:52 PM",
    starred: false,
  },
  {
    id: 4,
    name: "Anthony Briggs",
    status: null,
    time: "7:52 PM",
    starred: true,
  },
  {
    id: 5,
    name: "Clifford Morgan",
    status: "Unread",
    time: "4:13 PM",
    starred: false,
  },
  {
    id: 6,
    name: "Cecilia Webster",
    status: "Rejected",
    time: "3:52 PM",
    starred: false,
  },
  {
    id: 7,
    name: "Harvey Manning",
    status: null,
    time: "2:30 PM",
    starred: true,
  },
  {
    id: 8,
    name: "Willie Blake",
    status: "Accepted",
    time: "8:38 AM",
    starred: false,
  },
  {
    id: 9,
    name: "Minerva Barnett",
    status: "Rejected",
    time: "8:13 AM",
    starred: true,
  },
  {
    id: 10,
    name: "Fanny Weaver",
    status: null,
    time: "7:52 PM",
    starred: true,
  },
  {
    id: 11,
    name: "Olga Hogan",
    status: "Unread",
    time: "4:13 PM",
    starred: false,
  },
  {
    id: 12,
    name: "Lora Houston",
    status: "Unread",
    time: "7:52 PM",
    starred: false,
  },
];

const MessagingPage = () => {
  const [starredMessages, setStarredMessages] = useState(messages);
  const [rooms, setRooms] = useState(null);
  const [inboxCount, setInboxCount] = useState(0);
  const router = useRouter();
  const { userData } = useUser();


  useEffect(() => {
    const unsubscribe = listenToRoomsForUser(userData.firebase_uid, async (roomsList) => {
      // setRooms(roomsList); // Update state with real-time rooms
      let count = 0;
      await Promise.all(roomsList.map(async (room) => {
        const unreadMessageCount = await getUnreadMessageCount(room, auth.currentUser.uid);
        const roomName = await getOtherUserName(room);
        room.unreadMessageCount = unreadMessageCount;
        room.name = roomName;
        count += unreadMessageCount;
        if (unreadMessageCount > 0) {
          room.status = "Unread";
        }
      }));
      setInboxCount(count);
      setRooms(roomsList);
    });

    // Cleanup: Unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, [!userData.isEmpty]);

  const handleMessageClick = (id) => {
    router.push(`/dashboard/messaging/${id}`);
  }

  const handleStarClick = (id) => {
    setStarredMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === id ? { ...msg, starred: !msg.starred } : msg
      )
    );
  };

  return (
    <>
      <div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/4 bg-background rounded-xl p-6 flex flex-col gap-6">
            <Button className="rounded-lg w-full mb-4 lg:mb-0">
              + Compose
            </Button>
            <div>
              <h3 className="text-base font-bold text-foreground">My Email</h3>
              <ul>
                <li className="flex justify-between items-center bg-[#487fff29] p-3 rounded-lg my-2">
                  <div className="flex items-center gap-2">
                    <EmailIcon className="text-blue-500 mr-2" />
                    <span className="text-blue-500 text-sm font-bold">
                      Inbox
                    </span>
                  </div>
                  <span className="text-blue-500 text-sm font-bold">{inboxCount}</span>
                </li>

                <li className="flex justify-between items-center p-3 rounded-lg my-2">
                  <div className="flex items-center gap-2">
                    <DeleteIcon className="text-foreground mr-2" />
                    <span className="text-foreground text-sm font-bold">
                      Assigned To Me
                    </span>
                  </div>
                  <span className="text-foreground text-sm font-bold">9</span>
                </li>
                <li className="flex justify-between items-center p-3 rounded-lg my-2">
                  <div className="flex items-center gap-2">
                    <DeleteIcon className="text-foreground mr-2" />
                    <span className="text-foreground text-sm font-bold">
                      Deleted
                    </span>
                  </div>
                  <span className="text-foreground text-sm font-bold">9</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex-1 bg-background rounded-lg p-4 overflow-auto">
            <div className="flex flex-row lg:flex-row justify-between items-center mb-4 gap-4">
              <Input
                className="mb-0 w-full lg:max-w-[332px] rounded-full bg-midnight"
                placeholder="Search messages"
              />
              <TrashIcon className="bg-white p-2 text-white cursor-pointer" />
            </div>

            <div className="overflow-x-auto">
              <Table className="w-full min-w-[600px]">
                <TableBody>
                  {rooms?.map((room) => (
                    <TableRow
                      key={room.id}
                      className="border-b border-gray-600"
                      onClick={() => handleMessageClick(room.id)}
                    >
                      <TableCell>
                        <Checkbox
                          id={room.id}
                          iconClassName="text-background"
                          className="data-[state=checked]:bg-foreground rounded-sm h-5 w-5"
                        />
                      </TableCell>
                      <TableCell>
                        <div
                          className="cursor-pointer mx-2"
                          onClick={() => handleStarClick(room.id)}
                        >
                          {room.starred ? (
                            <Star className="text-yellow-400" />
                          ) : (
                            <Star className="text-gray-400" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="flex items-center">
                        <span className="text-white">{room.name}</span>
                      </TableCell>
                      <TableCell>
                        {room.status && (
                          <span
                            className={`px-2 py-1 rounded text-white text-xs ${room.status === "Accepted"
                                ? "bg-green-500"
                                : room.status === "Read"
                                  ? "bg-yellow-500"
                                  : room.status === "New"
                                    ? "bg-purple-500"
                                    : room.status === "Rejected"
                                      ? "bg-red-500"
                                      : "bg-blue-500"
                              }`}
                          >
                            {room.status}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-400">
                        {room.metadata?.lastMessageText}
                      </TableCell>
                      <TableCell className="text-gray-400">
                        {room.metadata?.lastMessageTime ? (new Date(
                          room.metadata?.lastMessageTime * 1000
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })) : "Just Now"}
                      </TableCell>
                      <TableCell className="text-gray-400">
                        {parseInt(room.unreadMessageCount) > 0 && (
                          <span className="custom-gradient px-2 py-1 text-white text-xs rounded-full">
                            {room.unreadMessageCount}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        <div className="flex mt-4 p-3 justify-center bg-white mb-4 max-w-20 rounded-sm max-h-7 items-center ml-auto">
          <button className="text-black rounded">
            <ChevronLeftIcon />
          </button>
          <div className="border-l border-gray-300 h-6 mx-2"></div>
          <button className="text-black rounded">
            <ChevronRightIcon />
          </button>
        </div>
      </div>
    </>
  );
};

export default MessagingPage;
