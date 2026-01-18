import Link from "next/link";
import Image from "next/image";
import image1 from "../../public/image1.png";

export default function NotFound() {
  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <div className="flex  items-center">
          <h1 className="text-6xl">Page Not found 404!</h1>
          <div>
            <Image
              src={image1}
              width={450}
              height={450}
              alt="Broken QR code picture"
            />
          </div>
        </div>
      </div>
    </>
  );
}
