/* eslint-disable @typescript-eslint/no-explicit-any */
// __tests__/middleware.test.ts
import { middleware } from "@/middleware";
import { NextResponse } from "next/server";

// 1. Cara Mock next/server yang aman untuk ESM & melacak Spy dengan benar
jest.mock("next/server", () => {
  return {
    __esModule: true,
    NextResponse: {
      next: jest.fn().mockImplementation((init) => ({
        status: 200,
        headers: new Map(),
        cookies: {
          set: jest.fn(),
        },
        ...init,
      })),
      redirect: jest.fn().mockImplementation((url) => ({
        status: 307,
        headers: new Map([["Location", url.toString()]]),
        cookies: {
          set: jest.fn(),
        },
      })),
    },
  };
});

const mockGetUser = jest.fn();

// Mock @supabase/ssr
jest.mock("@supabase/ssr", () => ({
  createServerClient: jest.fn((url, key, options) => {
    // Jalankan setAll secara manual atau simulasikan pemicu untuk coverage internal
    // Supabase memanggil ini ketika mendeteksi token baru
    if (options?.cookies?.setAll) {
      // Kita sediakan trigger internal agar bisa dites khusus
      (globalThis as any).__triggerSetAll = options.cookies.setAll;
    }
    return {
      auth: {
        getUser: mockGetUser,
      },
    };
  }),
}));

describe("UT-MW-001: Intersepsi Rute oleh Middleware", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockRequest: any;

  beforeEach(() => {
    jest.clearAllMocks();
    delete (globalThis as any).__triggerSetAll;

    mockRequest = {
      nextUrl: {
        pathname: "/admin/plut/dashboard",
        startsWith: (path: string) =>
          mockRequest.nextUrl.pathname.startsWith(path),
        clone: () => new URL("http://localhost:3000/admin/plut/dashboard"),
      },
      url: "http://localhost:3000/admin/plut/dashboard",
      headers: new Headers(),
      cookies: {
        get: jest.fn(),
        set: jest.fn(),
        getAll: jest.fn().mockReturnValue([]),
      },
    };
  });

  it("melakukan redirect user tanpa sesi yang mengakses /admin ke /admin/login", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });
    mockRequest.cookies.get.mockReturnValue(undefined);

    await middleware(mockRequest);

    expect(NextResponse.redirect).toHaveBeenCalledWith(
      new URL("http://localhost:3000/admin/login"),
    );
  });

  it("mengizinkan akses (NextResponse.next) jika user terautentikasi dengan benar", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-123", email: "admin@buleleng.com" } },
      error: null,
    });
    mockRequest.cookies.get.mockReturnValue({ value: "valid-token" });

    await middleware(mockRequest);

    expect(NextResponse.next).toHaveBeenCalled();
  });

  it("langsung meloloskan request jika rute bukan bagian dari proteksi /admin/plut", async () => {
    mockRequest.nextUrl.pathname = "/catalog";
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

    await middleware(mockRequest);

    expect(NextResponse.next).toHaveBeenCalled();
  });

  // 🎯 TEST CASE BARU: Menembak cakupan baris 14-18 (setAll)
  it("mengeksekusi fungsi setAll cookie saat Supabase memperbarui token", async () => {
    // Simulasikan seolah-olah user valid tapi tokennya di-refresh oleh Supabase
    mockGetUser.mockImplementation(async () => {
      if ((globalThis as any).__triggerSetAll) {
        // Picu fungsi setAll yang ada di dalam middleware Anda
        (globalThis as any).__triggerSetAll([
          { name: "sb-access-token", value: "new-token", options: {} },
        ]);
      }
      return { data: { user: { id: "user-123" } }, error: null };
    });

    await middleware(mockRequest);

    // Memastikan cookies.set pada request dipanggil (Baris 15)
    expect(mockRequest.cookies.set).toHaveBeenCalledWith(
      "sb-access-token",
      "new-token",
    );
    // Memastikan NextResponse.next dipanggil ulang untuk memperbarui objek response (Baris 16-17)
    expect(NextResponse.next).toHaveBeenCalled();
  });
});
