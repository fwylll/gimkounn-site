/* page-loader.js — GIMKOUNN
 * Fetches page-config from API and dynamically renders all sections.
 * Include in <head>, call: loadPage('home')
 */
(function(){
  var CONFIG_ENDPOINT = '/api/page-config/'+SITE;
  var SITE = 'gimkounn';
  var BRAND = 'GIMKOUNN';

  function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function escAttr(s){return esc(s).replace(/"/g,'&quot;');}

  // === SECTION RENDERERS (matches admin, adapted for frontend CSS) ===

  function renderPromoBarSection(s){
    var bg=s.bgColor||'var(--cta)';
    var msgs=s.messages||[];
    if(!msgs.length) msgs=[{text:s.text||'',label:s.ctaText||'Shop',url:s.ctaUrl||'/products/'}];
    var h='<div id="promoBar" style="background:'+bg+';color:var(--white);min-height:40px;display:flex;align-items:center;overflow:hidden"><div class="promo-track" style="display:flex;animation:promoScroll 40s linear infinite">';
    for(var i=0;i<msgs.length*3;i++){
      var m=msgs[i%msgs.length];
      h+='<div class="promo-item" style="display:flex;align-items:center;flex-shrink:0;white-space:nowrap;padding:0 48px"';
      h+='><span style="padding:0 16px;font-weight:500;letter-spacing:.5px">'+esc(m.text||'')+'</span>';
      if(m.url) h+='<a href="'+escAttr(m.url)+'" style="color:var(--white);font-weight:600">'+esc(m.label||'Shop')+' <span class="promo-arrow" style="display:inline-block;margin-left:2px">→</span></a>';
      h+='</div>';
    }
    h+='</div></div>';
    return h;
  }

  function renderHeroSection(s){
    var slides=s.slides||[];
    if(!slides.length) return '';
    var h='<div class="hero-carousel"><div class="hc-slides"><div class="hc-slide-track">';
    for(var i=0;i<slides.length;i++){
      var sl=slides[i];
      h+='<div class="hc-slide"><div class="hc-slide-img" style="background:url('+escAttr(sl.image||'/gimkounn-images/Roller_Shoes_pink_1780899836222.png')+') 50% 50% / cover no-repeat';
      if(sl.bgColor) h+=','+sl.bgColor;
      h+='"><div style="position:absolute;inset:0;background:rgba(0,0,0,.20)"></div>';
      if(sl.ctaText) h+='<a href="'+escAttr(sl.ctaUrl||'/products/')+'" class="hc-cta">'+esc(sl.ctaText)+'</a>';
      h+='</div></div>';
    }
    h+='</div></div>';
    if(slides.length>1){
      h+='<button class="hc-arrow hc-prev" onclick="moveCarousel(-1)">‹</button><button class="hc-arrow hc-next" onclick="moveCarousel(1)">›</button>';
      h+='<div class="hc-dots">';
      for(var i=0;i<slides.length;i++) h+='<span class="hc-dot'+(i===0?' active':'')+'" onclick="go('+i+')"></span>';
      h+='</div></div>';
    }
    h+='</div>';
    return h;
  }

  function renderTrustBarSection(s){
    var items=s.items||[];
    if(!items.length) return '';
    var h='<div class="trust-strip"><div class="trust-strip-inner">';
    for(var i=0;i<items.length;i++){
      h+='<div class="trust-item"><span class="ti">'+esc(items[i].icon||'✓')+'</span>'+esc(items[i].text||'')+'</div>';
    }
    h+='</div></div>';
    return h;
  }

  function renderAgeGroupsSection(s){
    var h='<div class="age-section"><div class="age-header"><h2>'+esc(s.title||'')+'</h2><p>'+esc(s.subtitle||'')+'</p></div><div class="age-grid">';
    var colors=['#FF9800','#7C3AED','#4A90E2'];
    var groups=s.groups||[];
    for(var i=0;i<groups.length;i++){
      var g=groups[i];
      h+='<div class="age-card"><div class="age-card-img" style="background:linear-gradient(135deg,'+colors[i%3]+','+colors[i%3]+')">';
      h+='<div class="age-label"><h3>'+esc(g.name||'')+'</h3><p>'+esc(g.desc||'')+'</p></div></div></div>';
    }
    h+='</div></div>';
    return h;
  }

  function renderGrowthSystemSection(s){
    var h='<div class="growth-section"><div class="growth-grid"><div class="growth-visual">📏</div><div class="growth-text">';
    if(s.label) h+='<div class="growth-label">'+esc(s.label)+'</div>';
    h+='<h2>'+esc(s.title||'')+'</h2>';
    if(s.description) h+='<p>'+esc(s.description)+'</p>';
    h+='<div class="growth-steps">';
    var steps=s.steps||[];
    for(var i=0;i<steps.length;i++){
      h+='<div class="growth-step"><span class="gs-icon">'+(i+1)+'</span><div><strong>'+esc(steps[i].title||'')+'</strong><p>'+esc(steps[i].desc||'')+'</p></div></div>';
    }
    h+='</div></div></div></div>';
    return h;
  }

  function renderVideoSection(s){
    var url=s.url||'';
    var h='<div class="video-section"><div class="video-header"><h2>'+esc(s.title||'')+'</h2><p>'+esc(s.subtitle||'')+'</p></div><div class="video-wrap">';
    if(url){
      h+='<div style="position:relative;padding:56.25% 0 0 0;width:100%">';
      if(url.indexOf('youtube')>-1||url.indexOf('youtu.be')>-1){
        var yid='';var m=url.match(/(?:v=|\/)([\w-]{11})/);
        if(m) yid=m[1];
        h+='<iframe src="https://www.youtube.com/embed/'+yid+'" style="position:absolute;top:0;left:0;width:100%;height:100%" frameborder="0" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe>';
      }else{
        h+='<video src="'+escAttr(url)+'" style="width:100%" controls></video>';
      }
      h+='</div>';
    }else{
      h+='<div class="video-placeholder"><span class="vp-icon">▶️</span><span class="vp-text">See '+BRAND+' in Action</span></div>';
    }
    h+='</div></div>';
    return h;
  }

  function renderReviewsSection(s){
    var reviews=s.reviews||s.reviewList||[];
    if(!reviews.length) return '';
    var h='<div class="reviews-section"><div class="reviews-inner"><div class="reviews-header"><h2>'+esc(s.title||'Reviews')+'</h2><p>'+esc(s.subtitle||'')+'</p></div><div class="reviews-grid">';
    for(var i=0;i<reviews.length;i++){
      var r=reviews[i];
      var starCount=r.stars||5;
      var stars='';
      for(var si=0;si<5;si++) stars+=si<starCount?'★':'☆';
      h+='<div class="review-card"><div class="review-stars">'+stars+'</div><p class="review-text">"'+esc(r.text||'')+'"</p><div class="review-author"><strong>'+esc(r.name||'Customer')+'</strong></div>'
      if(r.verified) h+='<div class="verified">✓ Verified Purchase</div>';
      h+='</div>';
    }
    h+='</div></div></div>';
    return h;
  }

  function renderBlogSection(s){
    var posts=s.posts||[];
    if(!posts.length) return '';
    var h='<div class="blog-section"><div class="blog-header"><h2>'+esc(s.title||'')+'</h2><p>'+esc(s.subtitle||'')+'</p></div><div class="blog-grid">';
    for(var i=0;i<posts.length;i++){
      var p=posts[i];
      h+='<div class="blog-card"><div class="blog-img"';
      if(p.image) h+=' style="background:url('+escAttr(p.image)+') 50% 50% / cover no-repeat"';
      else h+='><div class="blog-placeholder">📝';
      h+='</div><div class="blog-info"><h3>'+esc(p.title||'')+'</h3><p>'+esc((p.excerpt||'').substring(0,200))+'</p></div></div>';
    }
    h+='</div></div>';
    return h;
  }

  function renderPageHeroSection(s){
    var heading=s.heading||'';
    var bg=s.bgImage?'url('+escAttr(s.bgImage)+') 50% 50% / cover no-repeat, ':'';
    var bgColor=s.bgColor||'#1a1a2e';
    var h='<section class="page-hero" style="background:'+bg+'linear-gradient(135deg,'+bgColor+','+bgColor.replace('#','').replace(/.{2}$/,'')+'d)';
    h+=';color:var(--white);padding:80px 24px;text-align:center"><div style="position:relative;z-index:2"><h1 style="color:var(--white)">'+esc(heading||'')+'</h1>';
    if(s.subtitle) h+='<p style="color:rgba(255,255,255,.85);max-width:600px;margin:0 auto">'+esc(s.subtitle)+'</p>';
    h+='</div></section>';
    return h;
  }

  function renderAboutContentSection(s){
    var h='<section style="max-width:var(--w);margin:0 auto;padding:60px 24px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center"><div><h2>'+esc(s.title||'Our Mission')+'</h2>';
    if(s.mission) h+='<p style="color:var(--text2);line-height:1.8;font-size:1.05rem">'+esc(s.mission)+'</p>';
    if(s.extra) h+='<p style="color:var(--text2);line-height:1.8;font-size:1.05rem;margin-top:20px">'+esc(s.extra)+'</p>';
    h+='</div><div style="background:linear-gradient(135deg,#fce4ec,#e8f5ee);min-height:400px;border-radius:var(--radius);display:flex;align-items:center;justify-content:center;font-size:6rem">🛼</div></div></section>';
    if(s.features&&s.features.length){
      h+='<section style="background:var(--gray-bg);padding:60px 24px"><div style="max-width:var(--w);margin:0 auto;text-align:center"><h2>'+esc(s.title2||'Why Choose '+BRAND)+'</h2><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:24px;margin-top:40px">';
      for(var i=0;i<s.features.length;i++){
        var f=s.features[i];
        h+='<div style="background:var(--white);padding:28px 20px;border-radius:var(--radius-sm);box-shadow:0 2px 12px rgba(0,0,0,.04)"><div style="font-size:2rem;margin-bottom:10px">'+esc(f.icon||'')+'</div><h3 style="font-size:.92rem;font-weight:700;margin-bottom:6px">'+esc(f.title||'')+'</h3><p style="font-size:.78rem;color:var(--text2);line-height:1.5">'+esc(f.desc||'')+'</p></div>';
      }
      h+='</div></div></section>';
    }
    return h;
  }

  function renderContentCardsSection(s){
    var cards=s.cards||[];
    var h='<div class="cc-section"><div class="cc-header"><h2>'+esc(s.title||'')+'</h2><p>'+esc(s.subtitle||'')+'</p></div><div class="cc-grid">';
    for(var i=0;i<cards.length;i++){
      var c=cards[i];
      h+='<div class="cc-card fade-up"><span class="cc-icon">'+esc(c.icon||'📄')+'</span><h3>'+esc(c.title||'')+'</h3><p>'+esc(c.description||'')+'</p></div>';
    }
    h+='</div></div>';
    return h;
  }

  function renderContactInfoSection(s){
    var h='<section style="max-width:var(--w);margin:0 auto;padding:60px 24px"><div style="max-width:600px;margin:0 auto;text-align:center"><h2>'+esc(s.title||'Get in Touch')+'</h2>';
    if(s.intro) h+='<p style="color:var(--text2);margin:16px 0 32px;line-height:1.7">'+esc(s.intro)+'</p>';
    h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:32px">';
    if(s.email) h+='<div style="background:var(--gray-bg);padding:24px;border-radius:var(--radius-sm);text-align:center"><div style="font-size:2rem;margin-bottom:8px">📧</div><strong style="font-size:.85rem;display:block;margin-bottom:4px">Email</strong><p style="color:var(--cta);font-weight:600;font-size:.85rem">'+esc(s.email)+'</p></div>';
    if(s.location) h+='<div style="background:var(--gray-bg);padding:24px;border-radius:var(--radius-sm);text-align:center"><div style="font-size:2rem;margin-bottom:8px">📍</div><strong style="font-size:.85rem;display:block;margin-bottom:4px">Location</strong><p style="color:var(--text2);font-size:.85rem">'+esc(s.location)+'</p></div>';
    h+='</div>';
    if(s.outro) h+='<p style="color:var(--text2);font-size:.9rem">'+esc(s.outro)+'</p>';
    h+='</div></section>';
    return h;
  }

  function renderBrandStorySection(s){
    var h='<section style="max-width:var(--w);margin:0 auto;padding:60px 24px"><div style="text-align:center;margin-bottom:36px"><h2>'+esc(s.title||'Our Story')+'</h2>';
    if(s.subtitle) h+='<p style="color:var(--text2)">'+esc(s.subtitle)+'</p>';
    h+='</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;background:var(--gray-bg);border-radius:var(--radius);overflow:hidden"><div style="min-height:350px;display:flex;align-items:center;justify-content:center;font-size:5rem;background:linear-gradient(135deg,#fce4ec,#e8f5ee)">';
    if(s.image) h+='<img src="'+escAttr(s.image)+'" style="width:100%;height:100%;object-fit:cover" alt="Story">'; else h+='📖';
    h+='</div><div style="padding:40px"><p style="color:var(--text2);line-height:1.8;font-size:1rem">'+esc((s.story||'').substring(0,500))+'</p>';
    if(s.stats&&s.stats.length){
      h+='<div style="display:flex;gap:24px;margin-top:24px;flex-wrap:wrap">';
      for(var i=0;i<s.stats.length;i++){
        h+='<div><div style="font-size:1.2rem;font-weight:900;color:var(--cta)">'+esc(s.stats[i].num||'')+'</div><div style="font-size:.72rem;color:var(--text3)">'+esc(s.stats[i].label||'')+'</div></div>';
      }
      h+='</div>';
    }
    h+='</div></div></section>';
    return h;
  }

  function renderFaqContentSection(s){
    var items=s.items||[];
    var h='<div class="cc-section" style="padding-top:20px"><div style="max-width:700px;margin:0 auto">';
    for(var i=0;i<items.length;i++){
      h+='<div class="faq-item" style="margin-bottom:20px;padding:24px;background:var(--gray-bg);border-radius:var(--radius-sm)"><h3 style="font-size:1rem;font-weight:700;margin-bottom:8px">❓ '+esc(items[i].q||'')+'</h3><div style="color:var(--text2);line-height:1.8;font-size:.9rem">'+esc(items[i].a||'')+'</div></div>';
    }
    h+='</div></div>';
    return h;
  }

  function renderMediaSection(s){
    var items=s.items||[];
    var h='<div class="media-section"><div class="media-header"><h2>'+esc(s.title||'')+'</h2><p>'+esc(s.subtitle||'')+'</p></div><div class="media-grid">';
    for(var i=0;i<items.length;i++){
      var m=items[i];
      h+='<div class="media-card"><div class="media-thumb">'+(m.type==='video'?'▶️':'📄')+'</div><div class="media-body">';
      if(m.tag) h+='<span class="media-tag">'+esc(m.tag)+'</span>';
      h+='<h3>'+esc(m.title||'')+'</h3><p>'+esc(m.description||'')+'</p></div></div>';
    }
    h+='</div></div>';
    return h;
  }

  function renderHeroBannerSection(s){
    var slides=s.slides||[];
    var h='<section class="hb"><div class="hb-track">';
    for(var i=0;i<slides.length;i++){
      var sl=slides[i];
      h+='<div class="hb-slide"><div class="hb-img" style="background-image:url('+escAttr(sl.image||'/gimkounn-images/Roller_Shoes_pink_1780899836222.png')+')"></div>';
      h+='<div class="hb-content"><h2>'+esc(sl.heading||'')+'</h2><p>'+esc(sl.subtitle||'')+'</p>';
      if(sl.ctaText) h+='<a href="'+escAttr(sl.ctaUrl||'/products/')+'" class="hb-cta">'+esc(sl.ctaText)+'</a>';
      h+='</div></div>';
    }
    h+='</div></section>';
    h+='<div class="products-section"><div class="products-header"><h2>Our Products</h2></div><div id="product-grid" class="products-grid"><div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text3)">Loading...</div></div></div>';
    return h;
  }

  function renderProductFilterSection(s){
    var h='<div class="products-section"><div class="products-header"><h2>Our Products</h2></div>';
    h+='<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;justify-content:center;padding:12px 0;border-bottom:1px solid var(--gray-light);margin-bottom:24px">';
    h+='<div style="display:flex;gap:6px;flex-wrap:wrap">';
    var filters=s.filters||[];
    for(var i=0;i<filters.length;i++){
      h+='<span class="filter-btn" data-filter="'+escAttr(filters[i].value||filters[i].label||'')+'" style="padding:6px 14px;border-radius:20px;font-size:.78rem;font-weight:600;cursor:pointer;'+(filters[i].active?'background:var(--cta);color:var(--white)':'color:var(--text2);background:var(--white);border:1.5px solid var(--gray-light)')+'">'+esc(filters[i].label||'')+'</span>';
    }
    h+='</div>';
    if(s.sortOptions&&s.sortOptions.length){
      h+='<select id="sortSelect" style="padding:8px 14px;border-radius:20px;border:1.5px solid var(--gray-light);font-size:.78rem;background:var(--white);color:var(--text2);margin-left:8px;cursor:pointer">';
      for(var i=0;i<s.sortOptions.length;i++){
        h+='<option value="'+escAttr(s.sortOptions[i].value||'')+'">'+esc(s.sortOptions[i].label||'')+'</option>';
      }
      h+='</select>';
    }
    h+='</div><div id="product-grid" class="products-grid"><div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text3)">Loading...</div></div></div>';
    return h;
  }

  // === MAIN LOADER ===

  function loadNavFooter(config){
    // Update nav and footer from config
    var nav=config.nav||{};
    var logo=document.querySelector('.nav-logo');
    if(logo) logo.textContent=nav.logo||BRAND;
    var cta=document.querySelector('.nav-cta');
    if(cta){
      if(nav.ctaText) cta.textContent=nav.ctaText;
      if(nav.ctaUrl) cta.href=nav.ctaUrl;
    }
    var footer=config.footer||{};
    var cols=footer.columns||[];
    var ftEl=document.querySelector('.site-footer-inner');
    if(ftEl&&cols.length){
      var brandCol=ftEl.querySelector('.ft-brand');
      if(brandCol){
        var logoEl=brandCol.querySelector('.ft-logo');
        if(logoEl) logoEl.textContent=nav.logo||BRAND;
        var descEl=brandCol.querySelector('p');
        if(descEl) descEl.textContent=config.seo&&config.seo.footerDescription||descEl.textContent;
      }
      var colEls=ftEl.querySelectorAll('.ft-col');
      for(var i=0;i<cols.length&&i<colEls.length;i++){
        var col=colEls[i];
        var heading=col.querySelector('h3');
        if(heading) heading.textContent=cols[i].title||heading.textContent;
        var links=cols[i].links||[];
        var linkEls=col.querySelectorAll('a');
        for(var j=0;j<links.length&&j<linkEls.length;j++){
          linkEls[j].textContent=links[j].label||linkEls[j].textContent;
          linkEls[j].href=links[j].url||linkEls[j].href;
        }
      }
    }
    // Update footer bottom
    var ftBottom=document.querySelector('.ft-bottom');
    if(ftBottom&&config.seo){
      var spans=ftBottom.querySelectorAll('span');
      if(spans.length>1){
        var email=config.seo.email||'contact@gimkounn.com';
        spans[1].textContent=config.seo.siteUrl?(config.seo.siteUrl.replace('https://','').replace(/\/$/,'')+' · '+email):email;
      }
    }
  }

  function initAnimations(){
    var obs=new IntersectionObserver(function(e){
      e.forEach(function(x){if(x.isIntersecting)x.target.classList.add('vis')});
    },{threshold:0.15});
    document.querySelectorAll('.fade-up,.fade-in,.scale-in').forEach(function(el){obs.observe(el)});
  }

  window.loadPage = function(pageKey){
    // Fetch page-config
    fetch(CONFIG_ENDPOINT+'?_t='+Date.now()).then(function(r){return r.json()}).then(function(config){
      var pages=config.pages||{};
      var pageData=pages[pageKey];
      if(!pageData) return;

      // 1. Update SEO
      var seoPages=config.seo&&config.seo.pages||{};
      var seo=seoPages[pageKey];
      if(seo){
        var titleEl=document.getElementById('seo-title')||document.querySelector('title');
        if(titleEl) titleEl.textContent=seo.title||titleEl.textContent;
        var descEl=document.getElementById('seo-desc')||document.querySelector('meta[name="description"]');
        if(descEl) descEl.content=seo.description||descEl.content;
      }

      // 2. Render sections into <main>
      var main=document.querySelector('main');
      if(!main) return;
      var secs=pageData.sections||[];
      if(secs.length){
        var html='';
        // Add brand tagline H1 for home page
        if(pageKey==='home'){
          var tagline=config.seo&&config.seo.tagline||'';
          html+='<div class="brand-tagline"><h1>'+esc(tagline)+'</h1></div>';
        }
        for(var i=0;i<secs.length;i++){
          var s=secs[i];
          if(s.enabled===false) continue;
          var t=s.type;
          if(t==='promoBar') html+=renderPromoBarSection(s);
          else if(t==='hero') html+=renderHeroSection(s);
          else if(t==='trustBar') html+=renderTrustBarSection(s);
          else if(t==='ageGroups') html+=renderAgeGroupsSection(s);
          else if(t==='growthSystem') html+=renderGrowthSystemSection(s);
          else if(t==='video') html+=renderVideoSection(s);
          else if(t==='reviews') html+=renderReviewsSection(s);
          else if(t==='blog') html+=renderBlogSection(s);
          else if(t==='pageHero') html+=renderPageHeroSection(s);
          else if(t==='aboutContent') html+=renderAboutContentSection(s);
          else if(t==='contentCards') html+=renderContentCardsSection(s);
          else if(t==='contactInfo') html+=renderContactInfoSection(s);
          else if(t==='brandStory') html+=renderBrandStorySection(s);
          else if(t==='faqContent') html+=renderFaqContentSection(s);
          else if(t==='media') html+=renderMediaSection(s);
          else if(t==='heroBanner') html+=renderHeroBannerSection(s);
          else if(t==='productFilter') html+=renderProductFilterSection(s);
        }
        main.innerHTML=html;
      }

      // 3. Nav/Footer from config
      loadNavFooter(config);

      // 4. Load products list if on products page
      if(pageKey==='products'){
        var pxhr = new XMLHttpRequest();
        pxhr.open('GET','/api/products/'+SITE,true);
        pxhr.onload = function(){
          try{ var d=JSON.parse(pxhr.responseText); }catch(e){ return; }
          var products=d.products||d||[];
          if(!Array.isArray(products)) products=[products];
          var grid=document.getElementById('product-grid');
          if(!grid) grid=document.getElementById('productGrid');
          if(!grid) return;
          var cards='';
          for(var i=0;i<products.length;i++){
            var p=products[i];
            if(!p||p._meta) continue;
            var stars='';var rs=Math.round(p.rating||4.5);
            for(var si=0;si<5;si++) stars+=si<rs?'★':'☆';
            var img=p.mainImage||(p.images&&p.images[0])||'';
            var href='/products/'+(p.slug||p.id||'led-roller-shoes');
            cards+='<a href="'+href+'/" class="product-card"><div class="product-img">'+(img?'<img src="'+escAttr(img)+'" alt="'+esc(p.title||'')+'" loading="lazy" onerror="this.parentElement.textContent=\'X\'">':'<span>🛼</span>')+'</div><div class="product-body"><h3>'+esc(p.title||'Product')+'</h3><div class="product-price">'+(p.originalPrice&&p.originalPrice>p.price?'<span style="text-decoration:line-through;color:#999;margin-right:6px">$'+p.originalPrice+'</span>':'')+'<span>$'+(p.price||'39.99')+'</span></div><div class="product-rating">'+stars+' '+(p.rating||'4.7')+'</div></div></a>';
          }
          grid.innerHTML=cards;
        };
        pxhr.send();
      }

      // 5. Re-init animations
      initAnimations();

      // 6. Init carousel if hero slides exist
      if(document.querySelector('.hc-slide')){
        if(window._ci!==undefined){
          window._ci=0;
          window._slides=Array.from(document.querySelectorAll('.hc-slide'));
          if(window._slides.length>1){
            window.go(0);
            if(window._timer) clearInterval(window._timer);
            window._timer=setInterval(function(){window.go(window._ci+1)},5000);
          }
        }
      }

      // 7. Setup filter/sort if present
      if(pageKey==='products') setupFilterSort();

    }).catch(function(err){console.error('page-loader:',err)});
  };

  // Save carousel helpers globally
  window._ci=0;
  window._slides=[];
  window._timer=null;
  window.go=function(i){
    var slides=Array.from(document.querySelectorAll('.hc-slide'));
    if(!slides.length) return;
    if(i<0) i=slides.length-1;
    if(i>=slides.length) i=0;
    var tr=document.querySelector('.hc-slide-track');
    if(tr) tr.style.transform='translateX(-'+(i*100)+'%)';
    document.querySelectorAll('.hc-dot').forEach(function(d,idx){d.classList.toggle('active',idx===i)});
    window._ci=i;
  };
  window.moveCarousel=function(dir){
    clearInterval(window._timer);
    window.go(window._ci+dir);
    window._timer=setInterval(function(){window.go(window._ci+1)},5000);
  };
  window.goCarousel=function(i){
    clearInterval(window._timer);
    window.go(i);
    window._timer=setInterval(function(){window.go(window._ci+1)},5000);
  };

  function setupFilterSort(){
    var btns=document.querySelectorAll('.filter-btn');
    var sort=document.getElementById('sortSelect');
    if(btns.length){
      btns.forEach(function(btn){
        btn.addEventListener('click',function(){
          btns.forEach(function(b){b.style.background='var(--white)';b.style.color='var(--text2)';b.style.border='1.5px solid var(--gray-light)'});
          this.style.background='var(--cta)';this.style.color='var(--white)';this.style.border='none';
          // Filter logic would require product categories
        });
      });
    }
  }
})();
