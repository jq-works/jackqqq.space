'use client';

import { useState, useEffect } from 'react';
import { Project, Skill, Education, Service, Achievement } from './types';

interface UseDataOptions {
  skip?: boolean;
}

export function useProjects(options?: UseDataOptions) {
  const [data, setData] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (options?.skip) return;

    const fetchData = async () => {
      try {
        const res = await fetch('/api/projects');
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        } else {
          setError(json.error);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [options?.skip]);

  return { data, loading, error };
}

export function useSkills(options?: UseDataOptions) {
  const [data, setData] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (options?.skip) return;

    const fetchData = async () => {
      try {
        const res = await fetch('/api/skills');
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        } else {
          setError(json.error);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [options?.skip]);

  return { data, loading, error };
}

export function useEducation(options?: UseDataOptions) {
  const [data, setData] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (options?.skip) return;

    const fetchData = async () => {
      try {
        const res = await fetch('/api/education');
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        } else {
          setError(json.error);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [options?.skip]);

  return { data, loading, error };
}

export function useServices(options?: UseDataOptions) {
  const [data, setData] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (options?.skip) return;

    const fetchData = async () => {
      try {
        const res = await fetch('/api/services');
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        } else {
          setError(json.error);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [options?.skip]);

  return { data, loading, error };
}

export function useAchievements(options?: UseDataOptions) {
  const [data, setData] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (options?.skip) return;

    const fetchData = async () => {
      try {
        const res = await fetch('/api/achievements');
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        } else {
          setError(json.error);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [options?.skip]);

  return { data, loading, error };
}
