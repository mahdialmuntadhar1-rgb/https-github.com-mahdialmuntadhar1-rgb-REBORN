import { Business } from '../types';

export const businesses: Business[] = [
  { 
    id: "1", 
    nameEn: "Zayouna Cafe", nameAr: "مقهى زيونة", nameKu: "کافێ زەیونە", 
    descriptionEn: "A nice cafe", descriptionAr: "مقهى جميل", descriptionKu: "کافێیەکی خۆش",
    category: "cafes", governorateId: "baghdad", 
    coverUrl: "https://picsum.photos/seed/zayouna/400/400",
    logoUrl: "https://picsum.photos/seed/zayouna-logo/100/100",
    isVerified: true,
    isPremium: true,
    rating: 4.8,
    reviewCount: 120,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  { 
    id: "2", 
    nameEn: "Al-Mansour Mall", nameAr: "مول المنصور", nameKu: "مۆڵی مەنسوور", 
    descriptionEn: "Shopping mall", descriptionAr: "مركز تسوق", descriptionKu: "مۆڵی بازاڕکردن",
    category: "shopping", governorateId: "baghdad", 
    coverUrl: "https://picsum.photos/seed/mansour/400/400",
    logoUrl: "https://picsum.photos/seed/mansour-logo/100/100",
    isVerified: true,
    rating: 4.5,
    reviewCount: 300,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  { 
    id: "3", 
    nameEn: "Erbil Citadel", nameAr: "قلعة أربيل", nameKu: "قەڵای هەولێر", 
    descriptionEn: "Historical landmark", descriptionAr: "معلم تاريخي", descriptionKu: "شوێنەواری مێژوویی",
    category: "landmark", governorateId: "erbil", 
    coverUrl: "https://picsum.photos/seed/erbil/400/400",
    logoUrl: "https://picsum.photos/seed/erbil-logo/100/100",
    isVerified: true,
    rating: 4.9,
    reviewCount: 500,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
];

// Generate more to reach 1000 for testing infinite scroll
for (let i = 4; i <= 1000; i++) {
  const isBaghdad = i % 3 === 0;
  const isErbil = i % 3 === 1;
  businesses.push({
    id: i.toString(),
    nameEn: `Business ${i}`,
    nameAr: `عمل ${i}`,
    nameKu: `کار ${i}`,
    descriptionEn: `Description for business ${i}`,
    descriptionAr: `وصف للعمل ${i}`,
    descriptionKu: `وەسف بۆ کار ${i}`,
    category: i % 2 === 0 ? "restaurants" : "shopping",
    governorateId: isBaghdad ? "baghdad" : isErbil ? "erbil" : "basra",
    coverUrl: `https://picsum.photos/seed/bus${i}/400/400`,
    logoUrl: `https://picsum.photos/seed/bus-logo${i}/100/100`,
    isVerified: i % 5 === 0,
    isPremium: i % 10 === 0,
    rating: 3 + (Math.random() * 2),
    reviewCount: Math.floor(Math.random() * 500),
    status: 'approved',
    createdAt: new Date().toISOString()
  });
}
