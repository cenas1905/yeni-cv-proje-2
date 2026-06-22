// Core mock database implementation shared by client and server.
// To keep client and server in sync, the client (browser) forwards queries to '/api/mock/db'
// while the server executes them directly in memory.

export const MOCK_USER = {
  id: 'mock-user-id-12345',
  email: 'demo@cvio.app',
  user_metadata: { full_name: 'Demo Kullanıcı' },
  aud: 'authenticated',
  role: 'authenticated',
  created_at: new Date().toISOString(),
};

export const MOCK_SESSION = {
  user: MOCK_USER,
  access_token: 'mock-token',
  refresh_token: 'mock-refresh',
  expires_at: Date.now() + 3600 * 1000,
};

// Initialize server-side global stores
const getGlobalStore = () => {
  if (typeof window !== 'undefined') {
    return {
      cvs: {},
      profiles: {},
      subscriptions: {},
      cover_letters: {},
      cv_views: {}
    };
  }
  
  const g = globalThis as any;
  g.mockCVStore = g.mockCVStore || {};
  g.mockProfileStore = g.mockProfileStore || {
    [MOCK_USER.id]: {
      id: MOCK_USER.id,
      email: MOCK_USER.email,
      full_name: 'Demo Kullanıcı',
      plan: 'free',
      created_at: new Date().toISOString()
    }
  };
  g.mockSubscriptionStore = g.mockSubscriptionStore || {};
  g.mockCoverLettersStore = g.mockCoverLettersStore || {};
  g.mockCVViewsStore = g.mockCVViewsStore || {};
  g.mockJobPreferencesStore = g.mockJobPreferencesStore || {};
  g.mockEmployerJobsStore = g.mockEmployerJobsStore || {
    'job-1': {
      id: 'job-1',
      employer_user_id: 'emp-123',
      company_name: 'TechFlow A.Ş.',
      job_title: 'Senior Frontend Developer',
      location: 'İstanbul / Uzaktan',
      work_type: 'Uzaktan',
      salary_range: '80.000 TL - 120.000 TL',
      description: 'Modern web uygulamaları geliştirecek React ve Next.js uzmanı arıyoruz.',
      requirements: ['React', 'Next.js', 'TypeScript', '3+ yıl tecrübe'],
      is_active: true,
      created_at: new Date().toISOString()
    },
    'job-2': {
      id: 'job-2',
      employer_user_id: 'emp-456',
      company_name: 'DataCorp Türkiye',
      job_title: 'Full Stack Engineer',
      location: 'Ankara',
      work_type: 'Hibrit',
      salary_range: '70.000 TL - 100.000 TL',
      description: 'Backend ve Frontend süreçlerine hakim yazılım mühendisi.',
      requirements: ['Node.js', 'React', 'PostgreSQL', 'Git'],
      is_active: true,
      created_at: new Date().toISOString()
    }
  };
  g.mockJobApplicationsStore = g.mockJobApplicationsStore || {};

  return {
    cvs: g.mockCVStore,
    profiles: g.mockProfileStore,
    subscriptions: g.mockSubscriptionStore,
    cover_letters: g.mockCoverLettersStore,
    cv_views: g.mockCVViewsStore,
    job_preferences: g.mockJobPreferencesStore,
    employer_jobs: g.mockEmployerJobsStore,
    job_applications: g.mockJobApplicationsStore
  };
};

export async function executeMockQuery(
  table: string,
  operation: string,
  data: any,
  filters: any,
  isSingle: boolean
): Promise<{ data: any; error: any }> {
  // If in browser, forward to mock DB API to keep client & server in sync
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/mock/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table, operation, data, filters, isSingle })
      });
      if (!res.ok) {
        throw new Error(`Mock DB request failed with status ${res.status}`);
      }
      return await res.json();
    } catch (err: any) {
      console.error('Client mock DB error:', err);
      return { data: null, error: { message: err.message } };
    }
  }

  // Server-side direct execution
  const store = getGlobalStore();

  if (table === 'profiles') {
    const userId = filters?.id || MOCK_USER.id;
    let profile = store.profiles[userId];
    
    // Ensure default profile exists
    if (!profile && userId === MOCK_USER.id) {
      profile = {
        id: MOCK_USER.id,
        email: MOCK_USER.email,
        full_name: 'Demo Kullanıcı',
        plan: 'free',
        created_at: new Date().toISOString()
      };
      store.profiles[MOCK_USER.id] = profile;
    }

    if (operation === 'update') {
      if (profile) {
        store.profiles[userId] = { ...profile, ...data };
        profile = store.profiles[userId];
      } else {
        store.profiles[userId] = { id: userId, ...data, created_at: new Date().toISOString() };
        profile = store.profiles[userId];
      }
      return { data: profile, error: null };
    }

    return isSingle
      ? { data: profile || null, error: null }
      : { data: profile ? [profile] : [], error: null };
  }

  if (table === 'cvs') {
    const cvsList = Object.values(store.cvs);

    if (operation === 'insert') {
      const newCV = {
        id: data?.id || `cv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        user_id: data?.user_id || MOCK_USER.id,
        title: data?.title || 'Yeni CV',
        data: data?.data || {},
        template: data?.template || 'modern',
        is_public: data?.is_public || false,
        slug: data?.slug || `cv-${Date.now()}`,
        pdf_url: data?.pdf_url || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...data
      };
      store.cvs[newCV.id] = newCV;
      return { data: newCV, error: null };
    }

    if (operation === 'update') {
      const id = filters?.id;
      if (id && store.cvs[id]) {
        store.cvs[id] = {
          ...store.cvs[id],
          ...data,
          updated_at: new Date().toISOString()
        };
        return { data: store.cvs[id], error: null };
      }
      
      // Fallback update if id is in filters or not found
      if (id) {
        const fallbackCV = {
          id,
          user_id: MOCK_USER.id,
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        store.cvs[id] = fallbackCV;
        return { data: fallbackCV, error: null };
      }

      // If no ID filter, update first CV
      const firstId = Object.keys(store.cvs)[0];
      if (firstId) {
        store.cvs[firstId] = {
          ...store.cvs[firstId],
          ...data,
          updated_at: new Date().toISOString()
        };
        return { data: store.cvs[firstId], error: null };
      }

      return { data: null, error: { message: 'CV bulunamadı' } };
    }

    if (operation === 'select') {
      // Filter by id or user_id
      let result = cvsList;
      if (filters?.id) {
        const cv = store.cvs[filters.id];
        if (isSingle) {
          return { data: cv || null, error: cv ? null : { message: 'CV bulunamadı' } };
        }
        result = cv ? [cv] : [];
      } else if (filters?.user_id) {
        result = cvsList.filter((cv: any) => cv.user_id === filters.user_id);
      } else if (filters?.slug) {
        result = cvsList.filter((cv: any) => cv.slug === filters.slug);
      }

      if (isSingle) {
        return { data: result[0] || null, error: null };
      }
      // Sort by updated_at descending
      result.sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      return { data: result, error: null };
    }

    if (operation === 'delete') {
      const id = filters?.id;
      if (id) {
        delete store.cvs[id];
      }
      return { data: null, error: null };
    }
  }

  if (table === 'subscriptions') {
    if (operation === 'upsert' || operation === 'insert' || operation === 'update') {
      const subId = data?.stripe_subscription_id || `sub_mock_${Date.now()}`;
      const subscription = {
        id: subId,
        user_id: data?.user_id || MOCK_USER.id,
        stripe_subscription_id: subId,
        plan: data?.plan || 'pro',
        status: data?.status || 'active',
        current_period_end: data?.current_period_end || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString()
      };
      store.subscriptions[subscription.user_id] = subscription;
      return { data: subscription, error: null };
    }
    
    if (operation === 'select') {
      const userId = filters?.user_id || MOCK_USER.id;
      const sub = store.subscriptions[userId];
      return isSingle ? { data: sub || null, error: null } : { data: sub ? [sub] : [], error: null };
    }
  }

  if (table === 'cover_letters') {
    const clList = Object.values(store.cover_letters);
    if (operation === 'insert') {
      const cl = {
        id: `cl-${Date.now()}`,
        user_id: data?.user_id || MOCK_USER.id,
        ...data,
        created_at: new Date().toISOString()
      };
      store.cover_letters[cl.id] = cl;
      return { data: cl, error: null };
    }
    if (operation === 'select') {
      let result = clList;
      if (filters?.user_id) {
        result = clList.filter((cl: any) => cl.user_id === filters.user_id);
      }
      if (isSingle) {
        return { data: result[0] || null, error: null };
      }
      return { data: result, error: null };
    }
  }

  if (table === 'cv_views') {
    if (operation === 'insert') {
      const view = {
        id: `view-${Date.now()}`,
        cv_id: data?.cv_id,
        viewer_ip: data?.viewer_ip || '127.0.0.1',
        created_at: new Date().toISOString()
      };
      store.cv_views[view.id] = view;
      return { data: view, error: null };
    }
    if (operation === 'select') {
      const views = Object.values(store.cv_views).filter((v: any) => v.cv_id === filters?.cv_id);
      return { data: views, error: null };
    }
  }
  if (table === 'job_preferences') {
    if (operation === 'upsert' || operation === 'update' || operation === 'insert') {
      const pId = data?.user_id || MOCK_USER.id;
      const pref = { id: pId, user_id: pId, ...data };
      store.job_preferences[pId] = pref;
      return { data: pref, error: null };
    }
    if (operation === 'select') {
      const pId = filters?.user_id || MOCK_USER.id;
      return isSingle ? { data: store.job_preferences[pId] || null, error: null } : { data: store.job_preferences[pId] ? [store.job_preferences[pId]] : [], error: null };
    }
  }

  if (table === 'employer_jobs') {
    if (operation === 'insert') {
      const job = { id: `job-${Date.now()}`, ...data, created_at: new Date().toISOString() };
      store.employer_jobs[job.id] = job;
      return { data: job, error: null };
    }
    if (operation === 'select') {
      return { data: Object.values(store.employer_jobs), error: null };
    }
  }

  if (table === 'job_applications') {
    if (operation === 'insert') {
      const app = { id: `app-${Date.now()}`, ...data, created_at: new Date().toISOString() };
      store.job_applications[app.id] = app;
      return { data: app, error: null };
    }
    if (operation === 'select') {
      return { data: Object.values(store.job_applications), error: null };
    }
  }

  return isSingle ? { data: null, error: null } : { data: [], error: null };
}

export function createMockBuilder(table: string) {
  let _filters: Record<string, any> = {};
  let _data: any = null;
  let _operation: string = '';
  let _isSingle = false;

  const builder: any = {
    select: (cols?: string) => { 
      if (!_operation) _operation = 'select'; 
      return builder; 
    },
    insert: (data: any) => { _operation = 'insert'; _data = data; return builder; },
    update: (data: any) => { _operation = 'update'; _data = data; return builder; },
    delete: () => { _operation = 'delete'; return builder; },
    upsert: (data: any) => { _operation = 'upsert'; _data = data; return builder; },
    eq: (col: string, val: any) => { _filters[col] = val; return builder; },
    neq: (col: string, val: any) => builder,
    in: (col: string, val: any) => builder,
    order: (col: string, options?: any) => builder,
    limit: (val: number) => builder,
    single: () => { _isSingle = true; return builder; },
    maybeSingle: () => { _isSingle = true; return builder; },
    then: (resolve: any) => {
      const op = _operation || 'select';
      return executeMockQuery(table, op, _data, _filters, _isSingle)
        .then(resolve);
    },
  };

  // Make it thenable (awaitable)
  Object.defineProperty(builder, Symbol.toStringTag, { value: 'Promise' });
  
  return builder;
}

async function isMockLoggedIn() {
  if (typeof window !== 'undefined') {
    return document.cookie.split('; ').some(row => row.startsWith('cvio_mock_logged_in=true'));
  } else {
    try {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      return cookieStore.get('cvio_mock_logged_in')?.value === 'true';
    } catch {
      // During build time / static generation, cookies() call fails. Default to true.
      return true;
    }
  }
}

export function createMockSupabaseClient() {
  return {
    auth: {
      getUser: async () => {
        const loggedIn = await isMockLoggedIn();
        if (!loggedIn) {
          return { data: { user: null }, error: null };
        }
        return { data: { user: MOCK_USER }, error: null };
      },
      getSession: async () => {
        const loggedIn = await isMockLoggedIn();
        if (!loggedIn) {
          return { data: { session: null }, error: null };
        }
        return { data: { session: MOCK_SESSION }, error: null };
      },
      signInWithPassword: async ({ email, password }: any) => {
        if (password && password.length >= 6) {
          if (typeof window !== 'undefined') {
            document.cookie = 'cvio_mock_logged_in=true; path=/; max-age=31536000';
          }
          return { data: { user: { ...MOCK_USER, email }, session: MOCK_SESSION }, error: null };
        }
        return { data: { user: null, session: null }, error: { message: 'Şifre en az 6 karakter olmalıdır.' } };
      },
      signUp: async ({ email, options }: any) => {
        if (typeof window !== 'undefined') {
          document.cookie = 'cvio_mock_logged_in=true; path=/; max-age=31536000';
        }
        return {
          data: {
            user: {
              ...MOCK_USER,
              email,
              user_metadata: { full_name: options?.data?.full_name || 'Demo Kullanıcı' }
            },
            session: MOCK_SESSION
          },
          error: null
        };
      },
      signOut: async () => {
        if (typeof window !== 'undefined') {
          document.cookie = 'cvio_mock_logged_in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          window.location.href = '/login';
        }
        return { error: null };
      },
      onAuthStateChange: (callback: any) => {
        isMockLoggedIn().then(loggedIn => {
          callback(loggedIn ? 'SIGNED_IN' : 'SIGNED_OUT', loggedIn ? MOCK_SESSION : null);
        });
        return { data: { subscription: { unsubscribe: () => {} } } };
      },
    },
    from: (table: string) => createMockBuilder(table),
    storage: {
      from: (bucket: string) => ({
        upload: async (path: string, body: any, options?: any) => ({ data: { path }, error: null }),
        getPublicUrl: (path: string) => ({ data: { publicUrl: `/api/mock/pdf?path=${encodeURIComponent(path)}` } }),
        createBucket: async () => ({ data: null, error: null }),
        remove: async () => ({ data: null, error: null }),
      }),
      createBucket: async () => ({ data: null, error: null }),
    },
  };
}
