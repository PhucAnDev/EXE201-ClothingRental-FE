// src/hooks/useUsers.ts
// Small hook that dispatches loadUsers and returns users state.
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUsers } from "../features/users/usersSlice";
import type { RootState, AppDispatch } from "../store";

export function useUsers() {
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((s: RootState) => s.users.list);
  const loading = useSelector((s: RootState) => s.users.loading);

  useEffect(() => {
    dispatch(loadUsers());
  }, [dispatch]);

  return { users, loading };
}
