"use client";
import { useState, useEffect } from "react";
import { Post } from "@/lib/supabase";
import { localStorageUtils } from "@/lib/localStorage";

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        // Try to fetch from API first
        const res = await fetch("/api/posts");
        if (res.ok) {
          const apiPosts = await res.json();

          // Merge with localStorage posts
          const localPosts = localStorageUtils.getPosts();

          // Combine and deduplicate by slug
          const allPosts = [...apiPosts];
          localPosts.forEach((localPost) => {
            if (!allPosts.find((p) => p.slug === localPost.slug)) {
              allPosts.push(localPost);
            }
          });

          // Sort by created_at
          allPosts.sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );

          setPosts(allPosts);
        } else {
          throw new Error("Failed to fetch from API");
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        // Fall back to localStorage only
        const localPosts = localStorageUtils.getPosts();
        setPosts(localPosts);
        setError("Using offline posts");
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  return { posts, loading, error };
}

export function usePost(slug: string) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        // Try to fetch from API first
        const res = await fetch(`/api/posts/${slug}`);
        if (res.ok) {
          const apiPost = await res.json();
          setPost(apiPost);
        } else {
          throw new Error("Failed to fetch from API");
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        // Fall back to localStorage
        const localPost = localStorageUtils.getPostBySlug(slug);
        if (localPost) {
          setPost(localPost);
          setError("Viewing offline version");
        } else {
          setError("Post not found");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [slug]);

  return { post, loading, error };
}
