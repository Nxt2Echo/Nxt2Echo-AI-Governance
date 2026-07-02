import { useState, useEffect, useCallback } from "react";
import { fetchComplaints } from "@/services/api";
import { fallbackComplaints } from "@/services/fallbackData";

/**
 * Manages the complaints list with server-side filtering, sorting and pagination.
 * Re-fetches whenever any filter/sort/page param changes.
 * Gracefully falls back to client-side filter/sort/pagination of placeholder data on API failure.
 */
export function useComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter / sort / pagination state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState("date");
  const [sortDir, setSortDir] = useState("desc");

  const PAGE_SIZE = 10;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchComplaints({
        search,
        status: statusFilter,
        priority: priorityFilter,
        category: categoryFilter,
        page,
        limit: PAGE_SIZE,
        sort: sortField,
        order: sortDir,
      });

      // Backend may return { data, total, page, totalPages, categories }
      // or simply an array. Handle both shapes gracefully.
      if (Array.isArray(res)) {
        setComplaints(res);
        setTotal(res.length);
        setTotalPages(Math.ceil(res.length / PAGE_SIZE));
        setCategories(["All", ...new Set(res.map((c) => c.category))]);
      } else {
        setComplaints(res.data ?? []);
        setTotal(res.total ?? 0);
        setTotalPages(res.totalPages ?? 1);
        if (res.categories) setCategories(["All", ...res.categories]);
      }
    } catch (err) {
      console.warn("[useComplaints] API failed, performing client-side filter on fallback data.", err);
      
      // Client-side filter/sort/pagination on fallbackComplaints
      let data = [...fallbackComplaints];
      if (search) {
        const q = search.toLowerCase();
        data = data.filter(
          (c) =>
            c.title.toLowerCase().includes(q) ||
            c.id.toLowerCase().includes(q) ||
            c.area.toLowerCase().includes(q) ||
            c.department.toLowerCase().includes(q)
        );
      }
      if (statusFilter !== "All") data = data.filter((c) => c.status === statusFilter);
      if (priorityFilter !== "All") data = data.filter((c) => c.priority === priorityFilter);
      if (categoryFilter !== "All") data = data.filter((c) => c.category === categoryFilter);

      // Sort
      data.sort((a, b) => {
        let av = a[sortField], bv = b[sortField];
        if (typeof av === "string") {
          av = av.toLowerCase();
          bv = bv.toLowerCase();
        }
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });

      const derivedCategories = ["All", ...new Set(fallbackComplaints.map((c) => c.category))];
      setCategories(derivedCategories);
      setTotal(data.length);
      setTotalPages(Math.ceil(data.length / PAGE_SIZE) || 1);
      setComplaints(data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE));
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, priorityFilter, categoryFilter, page, sortField, sortDir]);

  useEffect(() => {
    load();
  }, [load]);

  const resetPage = () => setPage(1);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
    setPage(1);
  };

  return {
    complaints,
    total,
    totalPages,
    categories,
    loading,
    error,
    // Filter state
    search, setSearch,
    statusFilter, setStatusFilter,
    priorityFilter, setPriorityFilter,
    categoryFilter, setCategoryFilter,
    page, setPage,
    sortField,
    sortDir,
    toggleSort,
    resetPage,
    PAGE_SIZE,
  };
}
