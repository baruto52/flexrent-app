"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import Navbar
from "@/components/Navbar";

import { supabase }
from "@/lib/supabase";

import ConversationSidebar
from "@/components/ConversationSidebar";

import ChatArea
from "@/components/ChatArea";

export default function ChatPage() {

  const params =
    useParams();

  const router =
    useRouter();

  const receiverId =
    params.id as string;

  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState<any[]>([]);

  const [conversations, setConversations] =
    useState<any[]>([]);

  const [currentUser, setCurrentUser] =
    useState<any>(null);

  const [receiver, setReceiver] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [sending, setSending] =
    useState(false);

  useEffect(() => {

    init();

  }, []);

  async function init() {

    const {
      data: { session },
    } =
      await supabase.auth.getSession();

    if (!session) {

      router.push("/login");

      return;
    }

    setCurrentUser(
      session.user
    );

    await Promise.all([

      loadReceiver(),

      loadMessages(
        session.user.id
      ),

      loadConversations(
        session.user.id
      ),
    ]);

    subscribeMessages(
      session.user.id
    );
  }

  async function loadReceiver() {

    const {
      data,
    } =
      await supabase
        .from("profiles")
        .select("*")
        .eq(
          "id",
          receiverId
        )
        .maybeSingle();

    setReceiver(data);
  }

  async function loadConversations(
    userId: string
  ) {

    const {
      data,
    } =
      await supabase
        .from("messages")
        .select("*")
        .or(
          `sender_id.eq.${userId},receiver_id.eq.${userId}`
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    if (!data)
      return;

    const map =
      new Map();

    for (const msg of data) {

      const otherUserId =

        msg.sender_id === userId

          ? msg.receiver_id

          : msg.sender_id;

      if (
        map.has(
          otherUserId
        )
      ) continue;

      const {
        data: profile,
      } =
        await supabase
          .from("profiles")
          .select("*")
          .eq(
            "id",
            otherUserId
          )
          .maybeSingle();

      map.set(
        otherUserId,
        {

          userId:
            otherUserId,

          profile,

          latestMessage:
            msg.message,

          createdAt:
            msg.created_at,
        }
      );
    }

    setConversations(
      Array.from(
        map.values()
      )
    );
  }

  async function loadMessages(
    currentUserId: string
  ) {

    const { data } =
      await supabase
        .from("messages")
        .select("*")
        .or(
          `
          and(sender_id.eq.${currentUserId},receiver_id.eq.${receiverId}),
          and(sender_id.eq.${receiverId},receiver_id.eq.${currentUserId})
          `
        )
        .order(
          "created_at",
          {
            ascending: true,
          }
        );

    setMessages(data || []);

    setLoading(false);
  }

  function subscribeMessages(
    currentUserId: string
  ) {

    const channel =
      supabase
        .channel(
          `chat-${currentUserId}-${receiverId}`
        )
        .on(

          "postgres_changes",

          {

            event: "INSERT",

            schema: "public",

            table: "messages",
          },

          (payload) => {

            const newMessage =
              payload.new as any;

            const valid =

              (
                newMessage.sender_id ===
                currentUserId &&

                newMessage.receiver_id ===
                receiverId
              ) ||

              (
                newMessage.sender_id ===
                receiverId &&

                newMessage.receiver_id ===
                currentUserId
              );

            if (!valid)
              return;

            setMessages(
              (prev) => [

                ...prev,

                newMessage,
              ]
            );
          }
        )
        .subscribe();

    return () => {

      supabase.removeChannel(
        channel
      );
    };
  }

  async function sendMessage() {

    if (
      !message.trim()
    ) return;

    if (!currentUser)
      return;

    try {

      setSending(true);

      await supabase
        .from("messages")
        .insert({

          sender_id:
            currentUser.id,

          receiver_id:
            receiverId,

          message:
            message.trim(),

          listing_id: null,
        });

      setMessage("");

    } catch (error) {

      console.log(error);

    } finally {

      setSending(false);
    }
  }

  if (loading) {

    return (

      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          text-3xl
          font-black
        "
      >

        Chat wird geladen...

      </div>

    );
  }

  return (

    <main className="h-screen bg-[#f5f7fb] overflow-hidden">

      <Navbar />

      <div
        className="
          h-[calc(100vh-96px)]
          flex
        "
      >

        {/* SIDEBAR */}

        <div
          className="
            hidden
            lg:block
          "
        >

          <ConversationSidebar
            conversations={
              conversations
            }
            activeId={
              receiverId
            }
          />

        </div>

        {/* CHAT */}

        <ChatArea

          receiver={
            receiver
          }

          messages={
            messages
          }

          currentUser={
            currentUser
          }

          message={
            message
          }

          setMessage={
            setMessage
          }

          sendMessage={
            sendMessage
          }

          sending={
            sending
          }

          router={
            router
          }

        />

      </div>

    </main>
  );
}