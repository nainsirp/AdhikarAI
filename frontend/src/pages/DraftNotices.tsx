import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';

const stateCities: Record<string, string[]> = {
  "Andaman & Nicobar Islands": ["Port Blair"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Tirupati", "Rajahmundry", "Kakinada", "Kadapa", "Anantapur", "Eluru", "Ongole"],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Namsai", "Tawang"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur", "Bongaigaon"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Bihar Sharif", "Arrah", "Begusarai", "Katihar", "Munger"],
  "Chandigarh": ["Chandigarh"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Rajnandgaon", "Jagdalpur", "Ambikapur", "Dhamtari"],
  "Dadra & Nagar Haveli and Daman & Diu": ["Daman", "Diu", "Silvassa"],
  "Delhi": ["New Delhi", "Delhi City", "Dwarka", "Rohini", "Noida (NCR)", "Gurugram (NCR)", "Faridabad (NCR)", "Ghaziabad (NCR)"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar", "Anand", "Nadiad", "Morbi", "Surendranagar"],
  "Haryana": ["Faridabad", "Gurugram", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal", "Sonipat", "Panchkula"],
  "Himachal Pradesh": ["Shimla", "Dharamshala", "Solan", "Mandi", "Bilaspur", "Kullu", "Chamba", "Hamirpur"],
  "Jammu & Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Kathua", "Sopore", "Sambha"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro Steel City", "Deoghar", "Hazaribagh", "Giridih", "Ramgarh", "Phusro"],
  "Karnataka": ["Bengaluru", "Hubballi-Dharwad", "Mysuru", "Kalaburagi", "Belagavi", "Mangaluru", "Davanagere", "Ballari", "Shivamogga", "Tumakuru"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Kollam", "Thrissur", "Alappuzha", "Palakkad", "Kannur", "Kottayam"],
  "Ladakh": ["Leh", "Kargil"],
  "Lakshadweep": ["Kavaratti", "Minicoy", "Amini"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam", "Rewa", "Murwara"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Pimpri-Chinchwad", "Nashik", "Kalyan-Dombivli", "Vasai-Virar", "Chhatrapati Sambhajinagar", "Navi Mumbai", "Solapur", "Amravati", "Kolhapur", "Akola"],
  "Manipur": ["Imphal", "Thoubal", "Kakching", "Ukhrul"],
  "Meghalaya": ["Shillong", "Tura", "Jowai", "Nongpoh"],
  "Mizoram": ["Aizawl", "Lunglei", "Champhai", "Serchhip"],
  "Nagaland": ["Dimapur", "Kohima", "Mokokchung", "Tuensang"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri", "Balasore", "Bhadrak", "Baripada"],
  "Puducherry": ["Puducherry", "Karaikal", "Mahe", "Yanam"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Sahibzada Ajit Singh Nagar", "Hoshiarpur", "Pathankot"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara", "Alwar", "Sikar", "Bharatpur", "Sri Ganganagar"],
  "Sikkim": ["Gangtok", "Namchi", "Geyzing", "Mangan"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tiruppur", "Erode", "Vellore", "Thoothukudi", "Tirunelveli", "Nagercoil"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Ramagundam", "Khammam", "Mahbubnagar", "Nalgonda"],
  "Tripura": ["Agartala", "Dharmanagar", "Udaipur", "Kailasahar"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Meerut", "Varanasi", "Prayagraj", "Bareilly", "Aligarh", "Noida", "Moradabad", "Gorakhpur", "Firozabad", "Jhansi", "Muzaffarnagar"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Haldwani", "Roorkee", "Rudrapur", "Kashipur", "Rishikesh"],
  "West Bengal": ["Kolkata", "Howrah", "Siliguri", "Asansol", "Durgapur", "Bardhaman", "Malda", "Kharagpur", "Baharampur", "Jalpaiguri"]
};

interface DraftSummary {
  id: string;
  subject: string;
  savedAt: string;
}

export const DraftNotices: React.FC = () => {
  const printAreaRef = useRef<HTMLDivElement>(null);

  // States
  const [step, setStep] = useState(1);
  const [draftsList, setDraftsList] = useState<DraftSummary[]>([]);
  const [selectedDraftId, setSelectedDraftId] = useState('');

  // Form Inputs
  const [sName, setSName] = useState('');
  const [sAddr, setSAddr] = useState('');
  const [sState, setSState] = useState('');
  const [sCity, setSCity] = useState('');
  const [sCityOther, setSCityOther] = useState('');

  const [rName, setRName] = useState('');
  const [rAddr, setRAddr] = useState('');
  const [rState, setRState] = useState('');
  const [rCity, setRCity] = useState('');
  const [rCityOther, setRCityOther] = useState('');

  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');

  // AI response HTML
  const [docHtml, setDocHtml] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pastDraftId, setPastDraftId] = useState<string | null>(null);

  useEffect(() => {
    fetchDraftsList();
  }, []);

  const fetchDraftsList = async () => {
    try {
      const res = await apiClient.get('/notice');
      setDraftsList(res.data.drafts || []);
    } catch (err) {
      console.error('Failed to load past drafts:', err);
    }
  };

  const handleLoadDraft = async (id: string) => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await apiClient.get(`/notice/${id}`);
      const d = res.data.draft;

      // Populate form
      setSName(d.sName);
      setSAddr(d.sAddr);
      setSState(d.sState);
      setSCity(d.sCity);
      setSCityOther('');
      
      setRName(d.rName);
      setRAddr(d.rAddr);
      setRState(d.rState);
      setRCity(d.rCity);
      setRCityOther('');

      setSubject(d.subject);
      setDetails(d.details);
      setDocHtml(d.docHtml);

      setPastDraftId(d.id);
      setStep(4); // Go straight to preview
    } catch (err) {
      console.error(err);
      alert('Could not load draft.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateNotice = async () => {
    setLoading(true);
    try {
      const finalSCity = sCity === 'Other' ? sCityOther : sCity;
      const finalRCity = rCity === 'Other' ? rCityOther : rCity;

      const res = await apiClient.post('/ai/draft-notice', {
        subject,
        sName,
        sAddr,
        sCity: finalSCity,
        sState,
        rName,
        rAddr,
        rCity: finalRCity,
        rState,
        details
      });

      if (res.data.status === 'success') {
        setDocHtml(res.data.docHtml);
        setStep(4);
      }
    } catch (err) {
      console.error('Draft notice failed:', err);
      alert('Notice generation failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const finalSCity = sCity === 'Other' ? sCityOther : sCity;
      const finalRCity = rCity === 'Other' ? rCityOther : rCity;

      await apiClient.post('/notice/save', {
        id: pastDraftId || undefined,
        subject,
        sName,
        sAddr,
        sCity: finalSCity,
        sState,
        rName,
        rAddr,
        rCity: finalRCity,
        rState,
        details,
        docHtml
      });

      alert('Notice draft saved successfully!');
      fetchDraftsList();
    } catch (err) {
      console.error('Save failed:', err);
      alert('Failed to save notice draft.');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = () => {
    const html2pdf = (window as any).html2pdf;
    if (!html2pdf) {
      alert('PDF generation library not loaded.');
      return;
    }

    const element = printAreaRef.current;
    const opt = {
      margin:       15,
      filename:     `${subject.toLowerCase().replace(/[^a-z0-9]/g, '_')}_notice.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(element).set(opt).save();
  };

  const handleClear = () => {
    setSName('');
    setSAddr('');
    setSState('');
    setSCity('');
    setSCityOther('');
    setRName('');
    setRAddr('');
    setRState('');
    setRCity('');
    setRCityOther('');
    setSubject('');
    setDetails('');
    setDocHtml('');
    setPastDraftId(null);
    setSelectedDraftId('');
    setStep(1);
  };

  return (
    <div style={{ background: 'var(--warm-gray)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* HEADER NAVBAR */}
      <header className="navbar" style={{ position: 'relative', borderBottom: '1px solid var(--border)', background: '#fff', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/dashboard" className="btn-social" style={{ padding: '8px 12px' }}>
            ← Dashboard
          </Link>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Notice Drafter</h2>
        </div>
      </header>

      <div className="container" style={{ maxWidth: '800px', margin: '32px auto', padding: '0 16px' }}>
        
        {/* PAST DRAFTS DROPDOWN */}
        {draftsList.length > 0 && (
          <div className="past-drafts-wrap">
            <span className="past-drafts-label">Load saved draft notice:</span>
            <select 
              className="drafts-select" 
              value={selectedDraftId} 
              onChange={(e) => {
                setSelectedDraftId(e.target.value);
                handleLoadDraft(e.target.value);
              }}
            >
              <option value="">-- Choose Draft --</option>
              {draftsList.map((d) => (
                <option key={d.id} value={d.id}>{d.subject}</option>
              ))}
            </select>
          </div>
        )}

        {/* STEPPER COUNTER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: step === 1 ? 'var(--crimson)' : 'var(--mid-gray)' }}>Step 1: Sender Profile</span>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: step === 2 ? 'var(--crimson)' : 'var(--mid-gray)' }}>Step 2: Recipient Profile</span>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: step === 3 ? 'var(--crimson)' : 'var(--mid-gray)' }}>Step 3: Incident Dispute</span>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: step === 4 ? 'var(--crimson)' : 'var(--mid-gray)' }}>Step 4: Preview notice</span>
        </div>

        {/* PROGRESS LOADING */}
        {loading && (
          <div className="files-loading" style={{ display: 'block', marginBottom: '20px' }}>
            <span className="spinner"></span>Generating notice HTML using Gemini AI...
          </div>
        )}

        {/* STEP 1: SENDER */}
        {step === 1 && (
          <div className="section-card">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Sender Information</h3>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" placeholder="Your name" value={sName} onChange={(e) => setSName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Postal Address</label>
              <input type="text" className="form-input" placeholder="House/Flat number, building name, area" value={sAddr} onChange={(e) => setSAddr(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">State</label>
                <select className="form-input" value={sState} onChange={(e) => { setSState(e.target.value); setSCity(''); }}>
                  <option value="">Select State</option>
                  {Object.keys(stateCities).sort().map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">City</label>
                <select className="form-input" value={sCity} onChange={(e) => setSCity(e.target.value)} disabled={!sState}>
                  <option value="">Select City</option>
                  {sState && stateCities[sState]?.map(c => <option key={c} value={c}>{c}</option>)}
                  {sState && <option value="Other">Other (Type below)</option>}
                </select>
              </div>
            </div>
            {sCity === 'Other' && (
              <div className="form-group">
                <label className="form-label">Type City Name</label>
                <input type="text" className="form-input" placeholder="Type city" value={sCityOther} onChange={(e) => setSCityOther(e.target.value)} />
              </div>
            )}
            <button className="btn-login" style={{ marginTop: '16px' }} onClick={() => setStep(2)} disabled={!sName || !sAddr || !sState || !sCity}>
              Next: Recipient Details →
            </button>
          </div>
        )}

        {/* STEP 2: RECIPIENT */}
        {step === 2 && (
          <div className="section-card">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Recipient Information</h3>
            <div className="form-group">
              <label className="form-label">Full Name / Organization</label>
              <input type="text" className="form-input" placeholder="Recipient's name" value={rName} onChange={(e) => setRName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Postal Address</label>
              <input type="text" className="form-input" placeholder="Street name, landmark, area" value={rAddr} onChange={(e) => setRAddr(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">State</label>
                <select className="form-input" value={rState} onChange={(e) => { setRState(e.target.value); setRCity(''); }}>
                  <option value="">Select State</option>
                  {Object.keys(stateCities).sort().map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">City</label>
                <select className="form-input" value={rCity} onChange={(e) => setRCity(e.target.value)} disabled={!rState}>
                  <option value="">Select City</option>
                  {rState && stateCities[rState]?.map(c => <option key={c} value={c}>{c}</option>)}
                  {rState && <option value="Other">Other (Type below)</option>}
                </select>
              </div>
            </div>
            {rCity === 'Other' && (
              <div className="form-group">
                <label className="form-label">Type City Name</label>
                <input type="text" className="form-input" placeholder="Type city" value={rCityOther} onChange={(e) => setRCityOther(e.target.value)} />
              </div>
            )}
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button className="btn-social" style={{ flex: 1 }} onClick={() => setStep(1)}>← Back</button>
              <button className="btn-login" style={{ flex: 2 }} onClick={() => setStep(3)} disabled={!rName || !rAddr || !rState || !rCity}>
                Next: Dispute Details →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: DISPUTE DETAILS */}
        {step === 3 && (
          <div className="section-card">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Dispute & Incident details</h3>
            <div className="form-group">
              <label className="form-label">Subject Line</label>
              <input type="text" className="form-input" placeholder="e.g. Legal Notice for non-payment of dues" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Details of Incident</label>
              <textarea className="form-input" style={{ minHeight: '120px' }} placeholder="Provide dates, incident details, amount or resolution terms you require." value={details} onChange={(e) => setDetails(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button className="btn-social" style={{ flex: 1 }} onClick={() => setStep(2)}>← Back</button>
              <button className="btn-login" style={{ flex: 2 }} onClick={handleGenerateNotice} disabled={!subject || !details || loading}>
                Generate notice draft →
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PREVIEW & EDITOR */}
        {step === 4 && (
          <div>
            <div className="section-card" style={{ padding: '0px', overflow: 'hidden' }}>
              <div 
                ref={printAreaRef}
                style={{ background: '#fff', padding: '40px', minHeight: '600px', fontSize: '0.9rem', color: '#111', fontFamily: 'serif' }}
                dangerouslySetInnerHTML={{ __html: docHtml }}
              />
            </div>
            
            <div className="editor-actions" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '20px' }}>
              <button className="btn btn-clear-draft" style={{ flex: '1', minWidth: '120px' }} onClick={handleClear}>
                Clear / New Draft
              </button>
              <button className="btn btn-save-draft" style={{ flex: '1', minWidth: '120px' }} onClick={handleSaveDraft} disabled={saving}>
                {saving ? 'Saving...' : 'Save Draft'}
              </button>
              <button className="btn btn-download-pdf" style={{ flex: '2', minWidth: '160px' }} onClick={handleDownloadPDF}>
                Download PDF
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
export default DraftNotices;
