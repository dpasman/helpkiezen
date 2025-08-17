import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Vaatwassers from './pages/Vaatwassers.jsx'
import { SeoHead } from './seo/SeoHead.jsx'
import { HelmetProvider } from 'react-helmet-async'

class AppBoundary extends React.Component{
  constructor(p){super(p); this.state={error:null};}
  static getDerivedStateFromError(e){return {error:e};}
  componentDidCatch(e, info){console.error('Render error:', e, info);}
  render(){
    if(this.state.error){
      return <div style={{padding:24,fontFamily:'ui-sans-serif'}}>
        <h2 style={{fontWeight:700}}>Er ging iets mis</h2>
        <pre style={{whiteSpace:'pre-wrap'}}>{String(this.state.error)}</pre>
        <p><a href="/">Home</a> · <a href="/health">Health</a></p>
      </div>
    }
    return this.props.children
  }
}

const Health = () => <div style={{padding:20}}>Health OK</div>

// Home redirect + canonical naar /vaatwassers
function RedirectHome() {
  return (
    <>
      <SeoHead
        title="HelpKiezen – start"
        description="HelpKiezen helpt je kiezen. Momenteel focussen we op vaatwassers."
        canonical="https://helpkiezen.nl/vaatwassers"
      />
      <Navigate to="/vaatwassers" replace />
    </>
  )
}

export default function App() {
  return (
    <HelmetProvider>
      <AppBoundary>
        <Routes>
          <Route path="/" element={<RedirectHome />} />
          <Route path="/vaatwassers" element={<Vaatwassers />} />
          <Route path="/health" element={<Health />} />
        </Routes>
      </AppBoundary>
    </HelmetProvider>
  )
}
