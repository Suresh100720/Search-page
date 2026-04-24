import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import axios from 'axios';
import { message } from 'antd';
import debounce from 'lodash/debounce';

const API_BASE_URL = 'http://127.0.0.1:5000/api';
const STORAGE_KEY = 'talent_tracker_candidates';

export const useCandidates = () => {
  const [candidates, setCandidates] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.filter(c => c && c._id) : [];
    } catch (e) {
      return [];
    }
  });
  const [facets, setFacets] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('new');
  const [filters, setFilters] = useState({ skills: [], roles: [], locations: [], statuses: [] });

  // Use a ref to store the last fetched query to prevent redundant calls
  const lastFetchedQueryRef = useRef('');

  // 1. Debounce the search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 600); // Slightly longer delay for better UX

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 2. Fetch candidates only when debouncedSearchTerm, filters, or sortBy change
  useEffect(() => {
    const fetch = async () => {
      // Only fetch if something actually changed
      const currentQuery = debouncedSearchTerm;
      const filterString = JSON.stringify(filters);
      const sortString = sortBy;
      
      setLoading(true);
      try {
        const response = await axios.post(`${API_BASE_URL}/search`, { 
          query: currentQuery,
          filters,
          sort: sortBy
        });
        
        const hits = response.data.hits || [];
        setCandidates(hits);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(hits));
        
        // Fetch facets
        const facetsResponse = await axios.get(`${API_BASE_URL}/candidates/facets`);
        setFacets(facetsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [debouncedSearchTerm, filters, sortBy]);

  // Stable fetchCandidates for manual triggers (like add/delete)
  const fetchCandidates = useCallback(async (query = debouncedSearchTerm, currentFilters = filters, currentSort = sortBy) => {
    // This is now just a wrapper around the manual logic if needed, 
    // but the useEffect above handles the main 'live' searching.
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/search`, { 
        query,
        filters: currentFilters,
        sort: currentSort
      });
      const hits = response.data.hits || [];
      setCandidates(hits);
      const facetsResponse = await axios.get(`${API_BASE_URL}/candidates/facets`);
      setFacets(facetsResponse.data);
    } catch (error) {
      console.error('Error in manual fetch:', error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, filters, sortBy]);

  const addCandidate = async (values, callback) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/candidates`, values);
      const newList = [response.data, ...candidates];
      setCandidates(newList);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
      if (callback) callback();
      fetchCandidates();
      message.success('Candidate added successfully!');
    } catch (error) {
      message.error('Error adding candidate: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const updateCandidate = async (id, values) => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_BASE_URL}/candidates/${id}`, values);
      const newList = candidates.map(c => c._id === id ? response.data : c);
      setCandidates(newList);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
      fetchCandidates();
      message.success('Candidate updated successfully!');
      return true;
    } catch (error) {
      message.error('Error updating candidate');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteCandidate = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/candidates/${id}`);
      const newList = candidates.filter(c => c._id !== id);
      setCandidates(newList);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
      fetchCandidates();
      message.success('Candidate deleted!');
    } catch (error) {
      message.error('Error deleting candidate');
    }
  };

  const deleteMultipleCandidates = async (ids) => {
    try {
      await axios.post(`${API_BASE_URL}/candidates/bulk-delete`, { ids });
      const newList = candidates.filter(c => !ids.includes(c._id));
      setCandidates(newList);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
      fetchCandidates();
      message.success(`${ids.length} candidates deleted!`);
    } catch (error) {
      message.error('Error deleting candidates');
    }
  };



  return {
    candidates,
    facets,
    loading,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    fetchCandidates,
    debouncedSearchTerm,
    addCandidate,
    updateCandidate,
    deleteCandidate,
    deleteMultipleCandidates
  };
};
