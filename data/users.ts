interface User {
  id: string;
  email: string;
  password: string;
  role: "admin" | "sales";
  name: string;
}

export const users: User[] = [
  {
    id: "USR-001",
    email: "admin@partscentral.com",
    password: "admin@123",
    role: "admin",
    name: "Admin",
  },
  {
    id: "USR-002",
    email: "shiva@partscentral.com",
    password: "shiva@123",
    role: "sales",
    name: "Shiva",
  },
  {
    id: "USR-003",
    email: "ramjas@partscentral.com",
    password: "ramjas@123",
    role: "sales",
    name: "Ramjas",
  },
  {
    id: "USR-004",
    email: "mike@partscentral.com",
    password: "mike@123",
    role: "sales",
    name: "Mike Brown",
  },
  {
    id: "USR-005",
    email: "emily@partscentral.com",
    password: "emily@123",
    role: "sales",
    name: "Emily Davis",
  },
];
