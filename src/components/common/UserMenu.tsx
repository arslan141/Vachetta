import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import Link from "next/link";
import { Session } from "next-auth";
import dynamic from "next/dynamic";
import SignOutButton from "../account/SignOutButton";

const EditProfile = dynamic(() => import("./EditProfile"), {
  ssr: false,
});

export function UserMenu({ fastSession }: { fastSession: Session }) {
  const isAdmin = fastSession?.user?.role === 'admin';

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="text-sm px-4 py-2 font-medium transition-all text-[#A1A1A1] hover:text-[#EDEDED] flex items-center space-x-2">
            <svg
              data-testid="geist-icon"
              height="16"
              strokeLinejoin="round"
              viewBox="0 0 16 16"
              width="16"
              style={{ color: "currentColor" }}
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.75 0C5.95507 0 4.5 1.45507 4.5 3.25V3.75C4.5 5.54493 5.95507 7 7.75 7H8.25C10.0449 7 11.5 5.54493 11.5 3.75V3.25C11.5 1.45507 10.0449 0 8.25 0H7.75ZM6 3.25C6 2.2835 6.7835 1.5 7.75 1.5H8.25C9.2165 1.5 10 2.2835 10 3.25V3.75C10 4.7165 9.2165 5.5 8.25 5.5H7.75C6.7835 5.5 6 4.7165 6 3.75V3.25ZM2.5 14.5V13.1709C3.31958 11.5377 4.99308 10.5 6.82945 10.5H9.17055C11.0069 10.5 12.6804 11.5377 13.5 13.1709V14.5H2.5ZM6.82945 9C4.35483 9 2.10604 10.4388 1.06903 12.6857L1 12.8353V13V15.25V16H1.75H14.25H15V15.25V13V12.8353L14.931 12.6857C13.894 10.4388 11.6452 9 9.17055 9H6.82945Z"
                fill="currentColor"
              ></path>
            </svg>
            <span>{fastSession.user.name.split(" ")[0]}</span>
            {isAdmin && (
              <span className="bg-blue-500 text-white px-2 py-0.5 text-xs rounded-full">Admin</span>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span>My Account</span>
              <span className="font-normal text-xs text-gray-500">{fastSession.user.email}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {isAdmin && (
              <>
                <DropdownMenuItem>
                  <Link className="flex items-center w-full h-full" href="/admin">
                    <svg
                      data-testid="geist-icon"
                      height="16"
                      strokeLinejoin="round"
                      viewBox="0 0 16 16"
                      width="16"
                      className="mr-2"
                      style={{ color: "currentColor" }}
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM8.75 5C8.75 4.58579 8.41421 4.25 8 4.25C7.58579 4.25 7.25 4.58579 7.25 5V8C7.25 8.41421 7.58579 8.75 8 8.75C8.41421 8.75 8.75 8.41421 8.75 8V5ZM8 11.25C8.41421 11.25 8.75 10.9142 8.75 10.5C8.75 10.0858 8.41421 9.75 8 9.75C7.58579 9.75 7.25 10.0858 7.25 10.5C7.25 10.9142 7.58579 11.25 8 11.25Z"
                        fill="currentColor"
                      />
                    </svg>
                    <span>Admin Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem>
              <DialogTrigger asChild>
                <button className="flex items-center w-full h-full">
                  <svg
                    data-testid="geist-icon"
                    height="16"
                    strokeLinejoin="round"
                    viewBox="0 0 16 16"
                    width="16"
                    className="mr-2"
                    style={{ color: "currentColor" }}
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.75 0C5.95507 0 4.5 1.45507 4.5 3.25V3.75C4.5 5.54493 5.95507 7 7.75 7H8.25C10.0449 7 11.5 5.54493 11.5 3.75V3.25C11.5 1.45507 10.0449 0 8.25 0H7.75ZM6 3.25C6 2.2835 6.7835 1.5 7.75 1.5H8.25C9.2165 1.5 10 2.2835 10 3.25V3.75C10 4.7165 9.2165 5.5 8.25 5.5H7.75C6.7835 5.5 6 4.7165 6 3.75V3.25ZM2.5 14.5V13.1709C3.31958 11.5377 4.99308 10.5 6.82945 10.5H9.17055C11.0069 10.5 12.6804 11.5377 13.5 13.1709V14.5H2.5ZM6.82945 9C4.35483 9 2.10604 10.4388 1.06903 12.6857L1 12.8353V13V15.25V16H1.75H14.25H15V15.25V13V12.8353L14.931 12.6857C13.894 10.4388 11.6452 9 9.17055 9H6.82945Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  <span>Edit profile</span>
                </button>
              </DialogTrigger>
            </DropdownMenuItem>
            {!isAdmin && (
              <DropdownMenuItem>
                <Link className="flex items-center w-full h-full" href="/orders">
                  <svg
                    data-testid="geist-icon"
                    height="16"
                    strokeLinejoin="round"
                    viewBox="0 0 16 16"
                    width="16"
                    className="mr-2"
                    style={{ color: "currentColor" }}
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M14 3H2C1.72386 3 1.5 3.22386 1.5 3.5V5L14.5 5V3.5C14.5 3.22386 14.2761 3 14 3ZM1.5 12.5V6.5L14.5 6.5V12.5C14.5 12.7761 14.2761 13 14 13H2C1.72386 13 1.5 12.7761 1.5 12.5ZM2 1.5C0.895431 1.5 0 2.39543 0 3.5V12.5C0 13.6046 0.895431 14.5 2 14.5H14C15.1046 14.5 16 13.6046 16 12.5V3.5C16 2.39543 15.1046 1.5 14 1.5H2ZM4 10.75C4.41421 10.75 4.75 10.4142 4.75 10C4.75 9.58579 4.41421 9.25 4 9.25C3.58579 9.25 3.25 9.58579 3.25 10C3.25 10.4142 3.58579 10.75 4 10.75Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  <span>View orders</span>
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <SignOutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditProfile />
    </Dialog>
  );
}
