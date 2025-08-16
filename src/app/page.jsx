export default function Home() {
  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">Welcome to Eye Auth 👁️</h1>
      <p className="mt-2 text-gray-600">
        ไปที่ <a href="/login" className="text-blue-600 underline">Login</a> หรือ 
        <a href="/register" className="text-blue-600 underline ml-2">Register</a>
      </p>
    </main>
  );
}
