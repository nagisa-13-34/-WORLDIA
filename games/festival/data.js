export const VENUES=[{id:'club',name:'CITY CLUB',capacity:600,cost:180000,outdoor:false},{id:'hall',name:'NOVA HALL',capacity:2400,cost:650000,outdoor:false},{id:'park',name:'RIVER PARK',capacity:6000,cost:1100000,outdoor:true},{id:'field',name:'SKY FIELD',capacity:15000,cost:2800000,outdoor:true}];
export const ARTISTS=[
 ['LUMINA',88,1800000,'ポップ',92,90],['NEON HARBOR',74,950000,'エレクトロ',78,84],['EMBER NOTE',68,720000,'ロック',75,62],['MINT PARADE',61,510000,'ポップ',64,78],['ORBITAL KIDS',55,390000,'ダンス',59,71],['BLUE HOUR',48,280000,'ジャズ',42,45],['CIDER LOOP',43,220000,'インディー',46,58],['ASTER',36,150000,'R&B',39,52],['SUNDAY STATIC',31,110000,'ロック',35,34],['MELLOW MAP',25,75000,'アコースティック',28,30]
].map(([name,popularity,fee,genre,draw,sns],id)=>({id:String(id),name,popularity,fee,genre,draw,sns}));
export const WEATHER={晴れ:{attendance:1,satisfaction:4,trouble:.6},曇り:{attendance:.96,satisfaction:1,trouble:.8},雨:{attendance:.82,satisfaction:-7,trouble:1.35},大雨:{attendance:.58,satisfaction:-18,trouble:2.2},猛暑:{attendance:.86,satisfaction:-10,trouble:1.65}};

