export type Language = 'EN' | 'FR' | 'RW';

export interface Translations {
  nav: {
    brandSubtitle: string;
    searchPlaceholder: string;
    location: string;
    savedMeals: string;
    merchantPortal: string;
    adminPanel: string;
    signIn: string;
    signOut: string;
    shopperRole: string;
    merchantRole: string;
    adminRole: string;
    web: string;
    mobile: string;
  };
  hero: {
    valueBadge: string;
    title: string;
    subtitle: string;
    bagsRescued: string;
    co2Avoided: string;
    ecoPoints: string;
  };
  tabs: {
    surpriseBags: string;
    myOrders: string;
    favorites: string;
    ecoImpact: string;
    grid: string;
    map: string;
  };
  filters: {
    allDeals: string;
    bakery: string;
    cafe: string;
    restaurant: string;
    supermarket: string;
    hotel: string;
    timingLabel: string;
    allTimes: string;
    collectToday: string;
    collectTomorrow: string;
    hideSoldOut: string;
    hidingSoldOut: string;
    filterButton: string;
    resetFilters: string;
    dietaryLabel: string;
    vegetarian: string;
    vegan: string;
    halal: string;
    glutenFree: string;
    distanceRadius: string;
  };
  card: {
    soldOut: string;
    minValue: string;
    fastSelling: string;
    featuredDeal: string;
    boxesLeft: string;
    nextDrop: string;
    today: string;
    tomorrow: string;
    reserveBox: string;
    noItemsTitle: string;
    noItemsDesc: string;
  };
  modal: {
    holdActive: string;
    guaranteedLock: string;
    guaranteedValuePromise: string;
    valueDiscountNote: string;
    pickupTime: string;
    arrivePrompt: string;
    storeLocation: string;
    qty: string;
    refundGuarantee: string;
    reserveAndCheckout: string;
  };
  orders: {
    title: string;
    emptyText: string;
    cookWithChef: string;
  };
  favorites: {
    title: string;
    emptyText: string;
    alertTitle: string;
    quickGrab: string;
  };
  impact: {
    liveFootprint: string;
    title: string;
    heroProgress: string;
    toNextTier: string;
    viewCard: string;
    mealsRescued: string;
    co2Avoided: string;
    treeDays: string;
    phoneCharges: string;
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  EN: {
    nav: {
      brandSubtitle: 'Food Rescue',
      searchPlaceholder: 'Search bakeries, cafes, meals in Kigali...',
      location: 'Kigali',
      savedMeals: 'Saved',
      merchantPortal: 'Merchant',
      adminPanel: 'Admin',
      signIn: 'Sign In',
      signOut: 'Sign Out',
      shopperRole: 'Shopper',
      merchantRole: 'Merchant',
      adminRole: 'Admin',
      web: 'Web',
      mobile: 'Mobile',
    },
    hero: {
      valueBadge: "Chef's Surprise Bags • 3x Guaranteed Value",
      title: 'Rescue Delicious Food Bags in Kigali • Up to 70% Off',
      subtitle: 'Pay 1/3 of regular prices. Collect bakery treats, restaurant buffets, and groceries before closing time.',
      bagsRescued: 'Bags Rescued',
      co2Avoided: 'CO₂ Avoided',
      ecoPoints: 'Eco Points',
    },
    tabs: {
      surpriseBags: 'Surprise Bags',
      myOrders: 'My Orders',
      favorites: 'Favorites',
      ecoImpact: 'Eco Impact',
      grid: 'Grid',
      map: 'Map',
    },
    filters: {
      allDeals: 'All Deals',
      bakery: 'Bakery',
      cafe: 'Cafe',
      restaurant: 'Restaurant',
      supermarket: 'Supermarket',
      hotel: 'Hotel',
      timingLabel: 'Timing:',
      allTimes: 'All',
      collectToday: '🟢 Today',
      collectTomorrow: '⏳ Tomorrow',
      hideSoldOut: 'Hide Sold Out',
      hidingSoldOut: 'Hiding Sold Out',
      filterButton: 'Filters',
      resetFilters: 'Reset Filters',
      dietaryLabel: 'Dietary Preferences',
      vegetarian: 'Vegetarian',
      vegan: 'Vegan',
      halal: 'Halal',
      glutenFree: 'Gluten Free',
      distanceRadius: 'Distance Radius',
    },
    card: {
      soldOut: 'Sold Out',
      minValue: 'Min. Value',
      fastSelling: 'Fast Selling',
      featuredDeal: '🔥 Flash Deal of the Day',
      boxesLeft: 'surprise boxes left',
      nextDrop: 'Next drop:',
      today: 'Today',
      tomorrow: 'Tomorrow',
      reserveBox: 'Reserve Box',
      noItemsTitle: 'No surprise food boxes found',
      noItemsDesc: 'Try adjusting your search keywords, category, or distance radius.',
    },
    modal: {
      holdActive: 'Surprise Bag Hold Active:',
      guaranteedLock: 'Guaranteed item lock',
      guaranteedValuePromise: 'Guaranteed Value Promise',
      valueDiscountNote: 'By rescuing this package, you avoid ~2.5 kg of CO₂ emissions!',
      pickupTime: 'Pickup Time',
      arrivePrompt: 'Arrive at store before the window closes.',
      storeLocation: 'Store Location & Contact',
      qty: 'Qty:',
      refundGuarantee: '100% Refund Guarantee',
      reserveAndCheckout: 'Reserve & Checkout',
    },
    orders: {
      title: 'Your Active & Past Pickups',
      emptyText: 'No orders placed yet. Explore surprise boxes to rescue food!',
      cookWithChef: 'Cook with AI Chef',
    },
    favorites: {
      title: 'Your Favorite Food Rescue Partners',
      emptyText: 'Click the heart icon on any store to get notified when they drop new surprise boxes!',
      alertTitle: 'Favorite Alert:',
      quickGrab: 'Quick Grab',
    },
    impact: {
      liveFootprint: 'Live Eco Footprint',
      title: 'Community Food Rescue Impact',
      heroProgress: 'Eco-Hero Progress',
      toNextTier: 'Points to Next Tier',
      viewCard: 'Equivalence Card',
      mealsRescued: 'Meals Rescued',
      co2Avoided: 'CO₂e Avoided',
      treeDays: 'Tree-Days Eq.',
      phoneCharges: 'Phone Charges',
    },
  },

  FR: {
    nav: {
      brandSubtitle: 'Sauvetage Alimentaire',
      searchPlaceholder: 'Rechercher boulangeries, cafés, repas à Kigali...',
      location: 'Kigali',
      savedMeals: 'Sauvés',
      merchantPortal: 'Commerçant',
      adminPanel: 'Admin',
      signIn: 'Connexion',
      signOut: 'Déconnexion',
      shopperRole: 'Client',
      merchantRole: 'Commerçant',
      adminRole: 'Admin',
      web: 'Web',
      mobile: 'Mobile',
    },
    hero: {
      valueBadge: 'Paniers Surprise du Chef • Valeur 3x Garantie',
      title: 'Sauvez de Délicieux Paniers à Kigali • Jusqu’à -70%',
      subtitle: 'Payez 1/3 du prix normal. Récupérez viennoiseries, buffets de restaurant et courses avant la fermeture.',
      bagsRescued: 'Paniers Sauvés',
      co2Avoided: 'CO₂ Évité',
      ecoPoints: 'Points Éco',
    },
    tabs: {
      surpriseBags: 'Paniers Surprise',
      myOrders: 'Mes Commandes',
      favorites: 'Favoris',
      ecoImpact: 'Impact Éco',
      grid: 'Grille',
      map: 'Carte',
    },
    filters: {
      allDeals: 'Toutes les Offres',
      bakery: 'Boulangerie',
      cafe: 'Café',
      restaurant: 'Restaurant',
      supermarket: 'Supermarché',
      hotel: 'Hôtel',
      timingLabel: 'Créneau:',
      allTimes: 'Tous',
      collectToday: "🟢 Aujourd'hui",
      collectTomorrow: '⏳ Demain',
      hideSoldOut: 'Masquer Épuisés',
      hidingSoldOut: 'Épuisés Masqués',
      filterButton: 'Filtres',
      resetFilters: 'Réinitialiser',
      dietaryLabel: 'Préférences Alimentaires',
      vegetarian: 'Végétarien',
      vegan: 'Végétalien',
      halal: 'Halal',
      glutenFree: 'Sans Gluten',
      distanceRadius: 'Rayon de Distance',
    },
    card: {
      soldOut: 'Épuisé',
      minValue: 'Valeur Min.',
      fastSelling: 'Vente Rapide',
      featuredDeal: '🔥 Offre Flash du Jour',
      boxesLeft: 'paniers restants',
      nextDrop: 'Prochain créneau:',
      today: "Aujourd'hui",
      tomorrow: 'Demain',
      reserveBox: 'Réserver le Panier',
      noItemsTitle: 'Aucun panier surprise trouvé',
      noItemsDesc: 'Essayez de modifier vos critères de recherche ou le rayon kilométrique.',
    },
    modal: {
      holdActive: 'Panier Réservé Temporairement:',
      guaranteedLock: 'Article bloqué avec succès',
      guaranteedValuePromise: 'Garantie de Valeur Minimale',
      valueDiscountNote: 'En sauvant ce panier, vous évitez ~2.5 kg d’émissions de CO₂ !',
      pickupTime: 'Créneau de Récupération',
      arrivePrompt: 'Arrivez au commerce avant la fermeture du créneau.',
      storeLocation: 'Adresse & Contact du Commerce',
      qty: 'Qté:',
      refundGuarantee: 'Remboursement 100% Garanti',
      reserveAndCheckout: 'Réserver & Payer',
    },
    orders: {
      title: 'Vos Collectes Actives & Passées',
      emptyText: 'Aucune commande pour le moment. Explorez les paniers pour sauver de la nourriture !',
      cookWithChef: 'Cuisiner avec Chef IA',
    },
    favorites: {
      title: 'Vos Commerces Préférés',
      emptyText: 'Cliquez sur le cœur pour recevoir une alerte dès qu’un commerce ajoute des paniers !',
      alertTitle: 'Alerte Favori:',
      quickGrab: 'Prendre Vite',
    },
    impact: {
      liveFootprint: 'Empreinte Écologique en Direct',
      title: 'Impact Communautaire Anti-Gaspillage',
      heroProgress: 'Progression Éco-Héros',
      toNextTier: 'Points pour le Niveau Suivant',
      viewCard: 'Carte d’Équivalence',
      mealsRescued: 'Paniers Sauvés',
      co2Avoided: 'CO₂e Évité',
      treeDays: 'Jours-Arbres Éq.',
      phoneCharges: 'Recharges Téléphone',
    },
  },

  RW: {
    nav: {
      brandSubtitle: 'Kurokora Ibiribwa',
      searchPlaceholder: "Shakisha amavuriro y'imigati, amafunguro n'ahandi i Kigali...",
      location: 'Kigali',
      savedMeals: 'Byarokowe',
      merchantPortal: 'Umucuruzi',
      adminPanel: 'Ubuyobozi',
      signIn: 'Injira',
      signOut: 'Sohoka',
      shopperRole: 'Umuguzi',
      merchantRole: 'Umucuruzi',
      adminRole: 'Ubuyobozi',
      web: 'Urubuga',
      mobile: 'Muryohe',
    },
    hero: {
      valueBadge: "Amakarito y'Igitangaza • Agaciro k'Inshuro 3 Kemejwe",
      title: 'Gura Ibiryo Biryoshye i Kigali • Kugera kuri 70% Off',
      subtitle: "Ishyura 1/3 cy'igiciro gisanzwe. Fata imigati, ibiryo bya resitora n'ibiribwa mbere y'uko bafunga.",
      bagsRescued: 'Amakarito Yarokowe',
      co2Avoided: 'CO₂ Yirinzwemo',
      ecoPoints: "Amanota y'Ibidukikije",
    },
    tabs: {
      surpriseBags: 'Amakarito yose',
      myOrders: 'Ibyo Natumije',
      favorites: 'Ibyo Nkunda',
      ecoImpact: 'Ibidukikije',
      grid: 'Ibyerekanwa',
      map: 'Ikarita',
    },
    filters: {
      allDeals: 'Byose',
      bakery: 'Imigati',
      cafe: 'Kawa & Icyayi',
      restaurant: 'Resitora',
      supermarket: 'Isoko Nini',
      hotel: 'Hoteli',
      timingLabel: 'Igihe:',
      allTimes: 'Igihe Cyose',
      collectToday: '🟢 Uyu Munsi',
      collectTomorrow: '⏳ Ejo',
      hideSoldOut: 'Hisha Ibyashize',
      hidingSoldOut: 'Ibyashize Byahishwe',
      filterButton: 'Akayunguruzo',
      resetFilters: 'Subiza Ku Ntangiriro',
      dietaryLabel: 'Ubwoko bw’Ibyokurya',
      vegetarian: 'Ibitarimo Inyama',
      vegan: 'Ibituruka ku Bimera',
      halal: 'Halal',
      glutenFree: 'Ibitarimo Gluten',
      distanceRadius: 'Intera (Ibirometero)',
    },
    card: {
      soldOut: 'Byashize',
      minValue: 'Agaciro Min.',
      fastSelling: 'Birimo Gushira Vuba',
      featuredDeal: "🔥 Poromosiyo y'Umunsi",
      boxesLeft: 'amakarito asigaye',
      nextDrop: 'Ibindi bizaboneka:',
      today: 'Uyu munsi',
      tomorrow: 'Ejo',
      reserveBox: 'Bika Ikarito',
      noItemsTitle: "Nta makarito y'ibiryo abonetse",
      noItemsDesc: "Gerageza guhindura amagambo ushakisha cyangwa wagure intera y'aho uherereye.",
    },
    modal: {
      holdActive: 'Ikarito Yawe Ibikiwe By’agateganyo:',
      guaranteedLock: 'Ibyo wahisemo byabitswe',
      guaranteedValuePromise: 'Agaciro Gahambaye Kazigamwe',
      valueDiscountNote: 'Mu kurokora aya mafunguro, urinda ibiro ~2.5 bya CO₂ kwangiza ikirere!',
      pickupTime: 'Igihe cyo Kujya Kubifata',
      arrivePrompt: 'Gera ku iduka mbere y’uko isaha yo gufata irenga.',
      storeLocation: 'Aho Iduka Riherereye & Telefone',
      qty: 'Umubare:',
      refundGuarantee: 'Kugarurirwa Amafaranga 100%',
      reserveAndCheckout: 'Bika & Wishyure',
    },
    orders: {
      title: 'Ibyo Watumije Ubu & Byarangiye',
      emptyText: 'Nta byo uratumiza. Shakisha amakarito y’ibiryo urokore ibiribwa ubu!',
      cookWithChef: 'Teka Hamwe na Chef AI',
    },
    favorites: {
      title: 'Amaduka n’Amaresitora Ukunda',
      emptyText: 'Kanda ku mutima ku iduka ryose kugira ngo umenyeshwe iyo bashyizeho amakarito mashya!',
      alertTitle: 'Imenyekanisha:',
      quickGrab: 'Fata Vuba',
    },
    impact: {
      liveFootprint: 'Umurage w’Ibidukikije Ako Kanya',
      title: 'Uruhare Rwawe mu Kurokora Ibiribwa',
      heroProgress: 'Iterambere ry’Umutabazi w’Ibidukikije',
      toNextTier: 'Amanota Asigaye ngo Ukureho Ikindi Cyiciro',
      viewCard: 'Ikarita y’Igereranya',
      mealsRescued: 'Amafunguro Yarokowe',
      co2Avoided: 'CO₂e Yirinzwemo',
      treeDays: 'Iminsi y’Ibiti Eq.',
      phoneCharges: 'Gucaginga Telefone',
    },
  },
};
