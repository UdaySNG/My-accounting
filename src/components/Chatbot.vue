const knowledgeBase = [
  {
    category: 'security',
    keywords: ['wachtwoord', 'beveiliging', '2fa', 'twee-factor', 'authenticatie', 'backup codes'],
    responses: [
      {
        question: 'Hoe kan ik mijn wachtwoord wijzigen?',
        answer: 'Je kunt je wachtwoord wijzigen via Instellingen > Beveiliging. Zorg voor een sterk wachtwoord met minimaal 8 karakters, hoofdletters, kleine letters, cijfers en speciale tekens.'
      },
      {
        question: 'Wat is twee-factor authenticatie (2FA)?',
        answer: '2FA voegt een extra beveiligingslaag toe aan je account. Naast je wachtwoord moet je ook een code invoeren die gegenereerd wordt door een authenticator app. Je kunt 2FA activeren via Instellingen > Beveiliging.'
      },
      {
        question: 'Hoe activeer ik 2FA?',
        answer: '1. Ga naar Instellingen > Beveiliging\n2. Klik op "2FA activeren"\n3. Scan de QR-code met je authenticator app\n4. Voer de verificatiecode in\n5. Sla je backup codes op voor noodgevallen'
      },
      {
        question: 'Wat zijn backup codes?',
        answer: 'Backup codes zijn eenmalige codes die je kunt gebruiken om in te loggen als je je authenticator app niet bij de hand hebt. Bewaar deze codes op een veilige plek. Je kunt ze vinden in Instellingen > Beveiliging nadat je 2FA hebt geactiveerd.'
      }
    ]
  },
  {
    category: 'integrations',
    keywords: ['integratie', 'koppeling', 'bank', 'exact', 'mollie', 'stripe', 'woocommerce', 'shopify', 'hubspot', 'salesforce'],
    responses: [
      {
        question: 'Welke integraties zijn beschikbaar?',
        answer: 'We bieden integraties met:\n- Banken: Rabobank, ING\n- Boekhoudsoftware: Exact Online, Moneybird\n- Betaalproviders: Mollie, Stripe\n- Webwinkels: WooCommerce, Shopify\n- CRM: HubSpot, Salesforce'
      },
      {
        question: 'Hoe verbind ik mijn bank?',
        answer: '1. Ga naar Instellingen > Integraties\n2. Klik op "Verbind" bij je bank\n3. Volg de authenticatiestappen\n4. Bevestig de koppeling'
      },
      {
        question: 'Hoe werkt de Exact Online koppeling?',
        answer: 'De Exact Online koppeling synchroniseert automatisch je boekhouding. Na het verbinden worden transacties, facturen en andere gegevens automatisch gesynchroniseerd tussen de systemen.'
      },
      {
        question: 'Kan ik meerdere integraties tegelijk gebruiken?',
        answer: 'Ja, je kunt meerdere integraties tegelijk gebruiken. Bijvoorbeeld: je kunt zowel je bank als Exact Online koppelen, of meerdere betaalproviders gebruiken.'
      }
    ]
  },
  {
    category: 'general',
    keywords: ['help', 'ondersteuning', 'contact', 'probleem', 'fout', 'bug'],
    responses: [
      {
        question: 'Wat zijn de laatste updates?',
        answer: 'In versie 1.2.0 hebben we toegevoegd:\n- Nieuwe integraties (banken, boekhoudsoftware, betaalproviders, webwinkels, CRM)\n- Verbeterde 2FA implementatie\n- Verbeterde beveiliging\n- Nieuwe dashboard functionaliteit'
      }
    ]
  }
] 