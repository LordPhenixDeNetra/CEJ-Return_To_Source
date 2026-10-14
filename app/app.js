(function () {
  "use strict";

  // ── Stockage local (peut être indisponible : navigation privée, file://…) ──
  const stock = {
    lire(cle, defaut) {
      try { const v = localStorage.getItem(cle); return v === null ? defaut : JSON.parse(v); }
      catch { return defaut; }
    },
    ecrire(cle, valeur) {
      try { localStorage.setItem(cle, JSON.stringify(valeur)); } catch { /* ignoré */ }
    },
  };

  const $ = (sel) => document.querySelector(sel);
  let lang = LANGAGES[stock.lire("lang")] ? stock.lire("lang") : "java";
  const faits = stock.lire("faits", {});           // { "java:6": true }
  let masquerFaits = stock.lire("masquerFaits", false);

  // Ordre global : parties dans l'ordre, exercices dans l'ordre du fichier.
  const ordre = PARTIES.flatMap((p) => EXERCICES.filter((e) => e.partie === p.id));
  const parId = Object.fromEntries(ordre.map((e) => [e.id, e]));
  const partieDe = Object.fromEntries(PARTIES.map((p) => [p.id, p]));
  const numero = (e) => e.num || e.id;
  const libelle = (e) => (e.num ? e.num : "Exercice " + e.id);
  const estFait = (id, l = lang) => !!faits[l + ":" + id];

  // ── Mini-formatage : `code`, **gras**, listes "- ", sous-titres "### " ──
  const echapper = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const enLigne = (s) => echapper(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  function blocs(lignes) {
    let html = "", dansListe = false;
    for (const l of lignes) {
      const item = l.startsWith("- ");
      if (item && !dansListe) { html += "<ul>"; dansListe = true; }
      if (!item && dansListe) { html += "</ul>"; dansListe = false; }
      if (item) html += "<li>" + enLigne(l.slice(2)) + "</li>";
      else if (l.startsWith("### ")) html += "<h3>" + enLigne(l.slice(4)) + "</h3>";
      else html += "<p>" + enLigne(l) + "</p>";
    }
    return html + (dansListe ? "</ul>" : "");
  }
  const liste = (lignes) => "<ul>" + lignes.map((l) => "<li>" + enLigne(l) + "</li>").join("") + "</ul>";

  // ── Langage actif ──
  function appliquerLangue() {
    document.documentElement.style.setProperty("--lc", LANGAGES[lang].couleur);
    for (const b of document.querySelectorAll(".langue, .tuile")) {
      b.setAttribute("aria-pressed", String(b.dataset.lang === lang));
    }
  }
  function choisirLangue(l) {
    lang = l;
    stock.ecrire("lang", l);
    appliquerLangue();
    rendreSommaire();
    rendre();
  }

  function rendreLangues() {
    $("#langues").innerHTML = Object.entries(LANGAGES).map(([cle, l]) =>
      `<button class="langue" data-lang="${cle}" style="--c:${l.couleur}">${l.nom}</button>`).join("");
    $("#langues").addEventListener("click", (ev) => {
      const b = ev.target.closest("[data-lang]");
      if (b) choisirLangue(b.dataset.lang);
    });
  }

  // ── Barre latérale ──
  function rendreSommaire() {
    const filtre = $("#recherche").value.trim().toLowerCase();
    const courant = idCourant();
    const total = ordre.length;
    const nbFaits = ordre.filter((e) => estFait(e.id)).length;
    $("#progression-barre").innerHTML =
      `${LANGAGES[lang].nom} : ${nbFaits} / ${total} faits<div class="jauge"><span style="width:${(100 * nbFaits / total).toFixed(1)}%"></span></div>`;

    let html = "";
    for (const p of PARTIES) {
      const exos = ordre.filter((e) => e.partie === p.id).filter((e) => {
        if (masquerFaits && estFait(e.id) && e.id !== courant) return false;
        if (!filtre) return true;
        return [numero(e), e.titre, ...(e.notions || [])].join(" ").toLowerCase().includes(filtre);
      });
      if (!exos.length) continue;
      html += `<details class="partie-nav" open><summary>${echapper(p.titre)}</summary><ul>` +
        exos.map((e) => `<li><a href="#/ex/${e.id}"${e.id === courant ? ' aria-current="page"' : ""}>` +
          `<span class="n">${echapper(numero(e))}</span><span class="t">${echapper(e.titre)}</span>` +
          (estFait(e.id) ? '<span class="ok" aria-label="fait">✓</span>' : "") + "</a></li>").join("") +
        "</ul></details>";
    }
    $("#sommaire").innerHTML = html || '<p class="vide">Aucun exercice ne correspond.</p>';
  }

  // ── Pages ──
  function idCourant() {
    const m = location.hash.match(/^#\/ex\/(.+)$/);
    return m && parId[m[1]] ? m[1] : null;
  }

  function rendreAccueil() {
    const tuiles = Object.entries(LANGAGES).map(([cle, l]) => {
      const n = ordre.filter((e) => estFait(e.id, cle)).length;
      return `<button class="tuile" data-lang="${cle}" style="--c:${l.couleur}">
        <strong>${l.nom}</strong>
        <div class="compte">${n} / ${ordre.length} faits</div>
        <div class="jauge"><span style="width:${(100 * n / ordre.length).toFixed(1)}%"></span></div>
      </button>`;
    }).join("");

    const parties = PARTIES.map((p) => {
      const exos = ordre.filter((e) => e.partie === p.id);
      const n = exos.filter((e) => estFait(e.id)).length;
      return `<li><a href="#/ex/${exos[0].id}"><strong>${echapper(p.titre)}</strong> <small>· ${n}/${exos.length}</small><br><small>${echapper(p.resume)}</small></a></li>`;
    }).join("");

    $("#contenu").innerHTML = `
      <div class="accueil">
        <h1>Cahier d'exercices de programmation</h1>
        <p class="intro">${ordre.length} exercices, des bases jusqu'aux bases de données, à travailler en Java, Python, C, C++, Go et Rust. L'énoncé est le même pour tous ; l'encadré coloré explique comment l'adapter au langage choisi, en particulier quand celui-ci n'a ni classes, ni héritage, ni exceptions. Ta progression et tes notes sont enregistrées dans ce navigateur.</p>
        <h2>Choisis ton langage</h2>
        <div class="grille-langues">${tuiles}</div>
        <section class="carte adaptation">
          <h2>Mise en route : ${LANGAGES[lang].nom}</h2>
          ${liste(MISE_EN_ROUTE[lang])}
        </section>
        <h2>Parties</h2>
        <ul class="liste-parties">${parties}</ul>
        <p class="intro" style="margin-top:20px">Exercices adaptés du cahier de travaux pratiques « Programmation Orientée Objet en Java » de M. Joseph Ndong (Université Cheikh Anta Diop de Dakar). La numérotation reprend celle du cahier d'origine ; les exercices sont regroupés par thème.</p>
      </div>`;
    $("#contenu").querySelector(".grille-langues").addEventListener("click", (ev) => {
      const b = ev.target.closest("[data-lang]");
      if (b) choisirLangue(b.dataset.lang);
    });
    appliquerLangue();
  }

  function rendreExercice(e) {
    const p = partieDe[e.partie];
    const i = ordre.indexOf(e);
    const prec = ordre[i - 1], suiv = ordre[i + 1];
    const notesExo = e.langs && e.langs[lang];
    const notesPartie = p.notes[lang];
    const cleNotes = "notes:" + lang + ":" + e.id;

    const codes = (e.code || []).map((c) =>
      `<div class="bloc-code"><div class="titre-bloc">${echapper(c.titre)}</div><pre><code>${echapper(c.texte)}</code></pre></div>`).join("");
    const sortie = e.sortie
      ? `<div class="bloc-code"><div class="titre-bloc">Exemple d'exécution</div><pre><code>${echapper(e.sortie)}</code></pre></div>` : "";

    const adaptation = `
      <section class="carte adaptation">
        <h2>En ${LANGAGES[lang].nom}</h2>
        ${notesExo ? liste(notesExo) : "<p>Pas de difficulté propre à ce langage pour cet exercice : applique les rappels de la partie.</p>"}
        <details${notesExo ? "" : " open"}>
          <summary>Rappels ${LANGAGES[lang].nom} : ${echapper(p.titre)}</summary>
          ${liste(notesPartie)}
        </details>
      </section>`;

    const lien = (ex, cls, sens) => ex
      ? `<a class="${cls}" href="#/ex/${ex.id}"><small>${sens}</small>${echapper(libelle(ex))} · ${echapper(ex.titre)}</a>` : "";

    $("#contenu").innerHTML = `
      <div class="fil">${echapper(p.titre)}</div>
      <h1><span class="num">${echapper(libelle(e))}</span> · ${echapper(e.titre)}</h1>
      <div class="puces">${(e.notions || []).map((n) => `<span class="puce">${echapper(n)}</span>`).join("")}</div>
      <section class="carte"><h2>Énoncé</h2>${blocs(e.enonce)}</section>
      ${codes}${sortie}
      ${adaptation}
      <div class="suivi">
        <label class="case-fait"><input type="checkbox" id="fait"${estFait(e.id) ? " checked" : ""}> Fait en ${LANGAGES[lang].nom}</label>
      </div>
      <textarea class="notes-perso" id="notes" placeholder="Mes notes ou mon code pour cet exercice en ${LANGAGES[lang].nom} (enregistré automatiquement dans ce navigateur)…"></textarea>
      <nav class="navigation">${lien(prec, "prec", "← Précédent")}${lien(suiv, "suiv", "Suivant →")}</nav>`;

    $("#fait").addEventListener("change", (ev) => {
      const cle = lang + ":" + e.id;
      if (ev.target.checked) faits[cle] = true; else delete faits[cle];
      stock.ecrire("faits", faits);
      rendreSommaire();
    });
    const zone = $("#notes");
    zone.value = stock.lire(cleNotes, "");
    zone.addEventListener("input", () => stock.ecrire(cleNotes, zone.value));
  }

  function rendre() {
    const id = idCourant();
    if (id) rendreExercice(parId[id]); else rendreAccueil();
    document.title = id ? libelle(parId[id]) + " · " + parId[id].titre : "Cahier d'exercices";
  }

  // ── Démarrage ──
  rendreLangues();
  appliquerLangue();
  $("#masquer-faits").checked = masquerFaits;
  $("#masquer-faits").addEventListener("change", (ev) => {
    masquerFaits = ev.target.checked;
    stock.ecrire("masquerFaits", masquerFaits);
    rendreSommaire();
  });
  $("#recherche").addEventListener("input", rendreSommaire);

  const btnMenu = $("#btn-menu");
  const fermerMenu = () => { document.body.classList.remove("menu-ouvert"); btnMenu.setAttribute("aria-expanded", "false"); };
  btnMenu.addEventListener("click", () => {
    document.documentElement.style.setProperty("--haut-entete", $(".entete").offsetHeight + "px");
    const ouvert = document.body.classList.toggle("menu-ouvert");
    btnMenu.setAttribute("aria-expanded", String(ouvert));
  });
  $("#sommaire").addEventListener("click", (ev) => { if (ev.target.closest("a")) fermerMenu(); });

  window.addEventListener("hashchange", () => {
    rendreSommaire();
    rendre();
    window.scrollTo(0, 0);
    $("#contenu").focus({ preventScroll: true });
  });

  rendreSommaire();
  rendre();
})();
