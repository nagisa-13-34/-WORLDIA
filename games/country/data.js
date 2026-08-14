export const INDUSTRIES=[['agriculture','農業',48],['manufacturing','製造業',52],['it','IT',36],['tourism','観光',42],['finance','金融',45],['energy','エネルギー',50]].map(([id,name,value])=>({id,name,value,growth:0,support:5}));
export const NATIONS=[['ソレイユ連邦',78,82,70,52],['アルカ共和国',55,48,74,45],['ノースリム公国',67,35,62,58],['ヴェルデ共同体',46,61,55,67],['オルビス共和国',82,76,88,38]].map(([name,economy,population,technology,relation],id)=>({id:String(id),name,economy,population,technology,relation,trade:0,agreement:false}));
export const POLICY_INFO={education:['教育予算','education'],healthcare:['医療予算','health'],science:['科学技術投資','technology'],infrastructure:['インフラ投資','stability'],environment:['環境対策','environment'],energyPolicy:['エネルギー政策','energy'],industry:['産業支援','industrySupport']};

