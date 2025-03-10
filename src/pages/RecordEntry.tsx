
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import RecordEntryForm from '@/components/RecordEntryForm';
import MatchingInterface from '@/components/MatchingInterface';
import { Record, RecordMatch, MatchResult } from '@/types';
import { exampleRecords } from '@/utils/mockData';
import { ArrowLeft, Search, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const RecordEntry = () => {
  const [submittedRecord, setSubmittedRecord] = useState<Record | null>(null);
  const [matchResults, setMatchResults] = useState<RecordMatch | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleRecordSubmit = (record: Record) => {
    setSubmittedRecord(record);
    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      // Generate match results based on similarity
      const potentialMatches = exampleRecords
        .filter(existingRecord => {
          // Basic filtering for demo
          return (
            existingRecord.lastName.toLowerCase().includes(record.lastName.toLowerCase().substring(0, 3)) || 
            existingRecord.firstName.toLowerCase().includes(record.firstName.toLowerCase().substring(0, 3)) ||
            (existingRecord.birthDate && record.birthDate && 
             existingRecord.birthDate.substring(0, 7) === record.birthDate.substring(0, 7))
          );
        })
        .map(matchedRecord => {
          // Calculate similarity score
          let score = 0;
          const matchedOn: string[] = [];
          
          // First name match
          if (matchedRecord.firstName.toLowerCase() === record.firstName.toLowerCase()) {
            score += 25;
            matchedOn.push('First Name');
          } else if (matchedRecord.firstName.toLowerCase().includes(record.firstName.toLowerCase().substring(0, 3))) {
            score += 15;
            matchedOn.push('First Name (partial)');
          }
          
          // Last name match
          if (matchedRecord.lastName.toLowerCase() === record.lastName.toLowerCase()) {
            score += 25;
            matchedOn.push('Last Name');
          } else if (matchedRecord.lastName.toLowerCase().includes(record.lastName.toLowerCase().substring(0, 3))) {
            score += 15;
            matchedOn.push('Last Name (partial)');
          }
          
          // Birth date match
          if (matchedRecord.birthDate === record.birthDate) {
            score += 25;
            matchedOn.push('Birth Date');
          } else if (matchedRecord.birthDate.substring(0, 7) === record.birthDate.substring(0, 7)) {
            score += 15;
            matchedOn.push('Birth Year/Month');
          }
          
          // Gender match
          if (matchedRecord.gender === record.gender) {
            score += 10;
            matchedOn.push('Gender');
          }
          
          // Location match (village/district)
          if (record.village && matchedRecord.village === record.village) {
            score += 15;
            matchedOn.push('Village');
          }
          
          if (record.district && matchedRecord.district === record.district) {
            score += 10;
            matchedOn.push('District');
          }
          
          return {
            record: matchedRecord,
            score,
            matchedOn
          };
        })
        .filter(match => match.score > 30) // Only keep matches above threshold
        .sort((a, b) => b.score - a.score) // Sort by score descending
        .slice(0, 5); // Get top 5 matches
      
      const matchData: RecordMatch = {
        sourceRecord: record,
        potentialMatches
      };
      
      setMatchResults(matchData);
      setIsSearching(false);
      
      toast({
        title: "Search Complete",
        description: `Found ${potentialMatches.length} potential matching records.`,
      });
    }, 2000);
  };
  
  const handleMatchComplete = (result: MatchResult) => {
    // In a real app, this would save the match result to a database
    console.log('Match completed:', result);
    
    toast({
      title: result.status === 'matched' ? "Records Linked" : "Match Processed",
      description: result.status === 'matched' 
        ? "The records have been successfully linked." 
        : "The record has been processed.",
      duration: 3000,
    });
    
    // Reset state after a delay
    setTimeout(() => {
      setSubmittedRecord(null);
      setMatchResults(null);
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Link>
          
          <h1 className="text-3xl font-bold tracking-tight mb-2">Record Entry & Matching</h1>
          <p className="text-lg text-muted-foreground">
            Submit new patient records and find potential matches
          </p>
        </div>
        
        {!submittedRecord ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <RecordEntryForm onRecordSubmit={handleRecordSubmit} />
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-black border rounded-xl shadow-subtle p-6">
                <div className="flex items-center mb-4">
                  <Search className="w-5 h-5 mr-2 text-primary" />
                  <h2 className="text-xl font-semibold">How Matching Works</h2>
                </div>
                
                <div className="space-y-4 text-sm">
                  <p className="text-muted-foreground">
                    This system uses both deterministic and probabilistic record linkage 
                    to identify potential matches in the community database.
                  </p>
                  
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h3 className="font-medium mb-2">Match Factors</h3>
                    <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                      <li>Name similarity (accounting for spelling variations)</li>
                      <li>Date of birth (exact and partial matches)</li>
                      <li>Location information (village, district)</li>
                      <li>Gender</li>
                      <li>Household head or mother's name when available</li>
                    </ul>
                  </div>
                  
                  <div className="flex items-center p-3 bg-primary/10 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-primary flex-shrink-0 mr-2" />
                    <p className="text-xs text-primary">
                      When reviewing potential matches, consider the match confidence level 
                      and specific fields that matched.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-black border rounded-xl shadow-card p-6">
            {isSearching ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-primary/10">
                  <Search className="w-8 h-8 text-primary animate-pulse" />
                </div>
                <h3 className="text-xl font-medium mb-2">Searching for Matches</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  We're searching the community database for potential matches. 
                  This may take a moment...
                </p>
                <div className="w-48 h-1.5 bg-muted rounded-full overflow-hidden mx-auto mt-6">
                  <div className="h-full bg-primary rounded-full animate-progress"></div>
                </div>
              </div>
            ) : (
              <MatchingInterface 
                matchData={matchResults ? [matchResults] : []}
                onMatchComplete={handleMatchComplete}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default RecordEntry;
