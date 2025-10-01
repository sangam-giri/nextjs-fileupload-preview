import FileUpload from "@/components/FileUpload";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-3xl p-6 bg-white rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Upload & Preview Images
        </h1>
        <FileUpload />
      </div>
    </main>
  );
}
