=== SIDEBAR ===
<aside className="w-full md:w-80 flex-shrink-0">
<div className="bg-white/70 backdrop-blur-md border border-[#dbe1ff]/50 shadow-sm p-6 rounded-xl flex flex-col gap-6 sticky top-24">
<div className="border-b border-[#76777d]-variant pb-4">
<h2 className=" text-2xl text-[#0b1c30]">Filtreler</h2>
<p className=" text-sm text-[#45464d] mt-1">AI destekli eşleşme için tercihlerinizi belirleyin.</p>
</div>
<div className="flex flex-col gap-4">
<!-- CV URL Input -->
<div className="flex flex-col gap-1">
<label className=" text-sm text-[#45464d] flex items-center gap-1">
<Icon name="link" /> CV URL (LinkedIn/Drive)
                        </label>
<input className="w-full h-11 bg-[#e5eeff]-lowest border-[#76777d]-variant rounded-lg focus:border-[#0051d5] focus:ring-2 focus:ring-[#0051d5]/20 transition-all text-base" placeholder="https://..." type="text"/>
</div>
<!-- Job Type -->
<div className="flex flex-col gap-1">
<label className=" text-sm text-[#45464d]">Aranan Pozisyon</label>
<input className="w-full h-11 bg-[#e5eeff]-lowest border-[#76777d]-variant rounded-lg focus:border-[#0051d5] focus:ring-2 focus:ring-[#0051d5]/20 transition-all text-base" placeholder="Örn: Senior Frontend Developer" type="text"/>
</div>
<!-- Location Grid -->
<div className="grid grid-cols-2 gap-2">
<div className="flex flex-col gap-1">
<label className=" text-sm text-[#45464d]">Şehir</label>
<select className="w-full h-11 bg-[#e5eeff]-lowest border-[#76777d]-variant rounded-lg focus:border-[#0051d5] transition-all text-sm">
<option>İstanbul</option>
<option>Ankara</option>
<option>İzmir</option>
<option>Uzaktan</option>
</select>
</div>
<div className="flex flex-col gap-1">
<label className=" text-sm text-[#45464d]">İlçe</label>
<input className="w-full h-11 bg-[#e5eeff]-lowest border-[#76777d]-variant rounded-lg focus:border-[#0051d5] transition-all text-sm" placeholder="Beşiktaş" type="text"/>
</div>
</div>
<!-- Age & Toggle -->
<div className="flex flex-col gap-4 pt-2">
<div className="flex items-center justify-between">
<label className=" text-sm text-[#45464d]">Yaş Aralığı</label>
<input className="w-20 h-10 bg-[#e5eeff]-lowest border-[#76777d]-variant rounded-lg text-center " placeholder="25" type="number"/>
</div>
<label className="flex items-center justify-between cursor-pointer group">
<span className=" text-sm text-[#0b1c30]">Rastgele İş İlanları</span>
<div className="relative inline-block w-10 h-6">
<input className="sr-only peer" type="checkbox"/>
<div className="w-full h-full bg-[#76777d]-variant peer-checked:bg-[#0051d5] rounded-full transition-colors"></div>
<div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
</div>
</label>
</div>
</div>
<div className="flex flex-col gap-2 pt-4 border-t border-[#76777d]-variant">
<button className="w-full h-11 border border-[#76777d]-variant text-[#0b1c30]  rounded-lg hover:bg-[#d3e4fe] transition-colors active:scale-95">Tercihleri Kaydet</button>
<button className="w-full h-11 bg-[#0051d5] text-[#ffffff]  rounded-lg ai-shimmer shadow-md transition-all active:scale-95 flex items-center justify-center gap-2">
<Icon name="bolt" />
                        İş Ara
                    </button>
</div>
</div>
</aside>

=== MAIN ===
<main className="flex-1 flex flex-col gap-6">
<div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#76777d]-variant pb-4">
<div>
<h1 className=" text-2xl text-[#0b1c30]">İş Fırsatlarım</h1>
<p className=" text-base text-[#45464d] mt-1">AI profilinizle en uyumlu 24 yeni ilan bulundu.</p>
</div>
<div className="flex items-center gap-2">
<span className="text-sm  text-[#45464d]">Sıralama:</span>
<select className="bg-transparent border-none text-sm  text-[#0051d5] focus:ring-0 cursor-pointer">
<option>En Yüksek Eşleşme</option>
<option>En Yeni İlanlar</option>
<option>Maaş Skalası</option>
</select>
</div>
</div>
<!-- Jobs Grid -->
<div className="grid grid-cols-1 @container lg:grid-cols-2 gap-6">
<!-- Card 1 -->
<div className="bg-[#e5eeff]-lowest shadow-md rounded-xl p-6 border border-[#76777d]-variant hover:border-[#0051d5] transition-all flex flex-col gap-4 group">
<div className="flex justify-between items-start">
<div className="flex gap-4">
<div className="h-14 w-14 rounded-lg bg-[#e5eeff] border border-[#76777d]-variant flex items-center justify-center overflow-hidden">
<img className="w-10 h-10 object-contain" data-alt="A clean and minimal tech company logo featuring abstract geometric shapes representing networking and connectivity. The colors are professional navy blue and silver on a crisp white background. The logo reflects a high-end software development firm with a global presence, conveying reliability and innovation." src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4lrk-Kwd8CrN8SKi46RCWoNsRQeZyYyeNikTYQt80NsdKizTNVs3-fu4qk1NEg5XANQku3DPda2P66jjdoI9sfYtXzLcl6nd5GPCn4p7vCK5Tzf9DgE2bl0KNrV-D6v-LRj2LN69baXcv_DX1oDKImGl3e3QY7xvQG4SGFTiCmGyy7T2dcpbyo6l-p3vJr0_yrmfjLnWYhzTae3AxNFUGx7Xib8IVnFF4pQDw3i9GykoW-aKAOVHoFOm73aCHB29XxzFaMoji_yE"/>
</div>
<div>
<h3 className=" text-base font-bold text-[#0b1c30] group-hover:text-[#0051d5] transition-colors">Senior Frontend Developer</h3>
<p className=" text-sm text-[#45464d]">TechNova Solutions</p>
</div>
</div>
<div className="flex flex-col items-end gap-1">
<span className="bg-[#0051d5]-container text-[#ffffff]-container px-2 py-1 rounded-full text-sm font-bold flex items-center gap-1">
<Icon name="verified" />
                                98% Match
                            </span>
<span className="text-sm text-[#45464d] italic">2 saat önce</span>
</div>
</div>
<div className="flex flex-wrap gap-1">
<span className="bg-[#d3e4fe] text-[#45464d] px-2 py-1 rounded text-sm border border-[#76777d]-variant/30">Uzaktan</span>
<span className="bg-[#d3e4fe] text-[#45464d] px-2 py-1 rounded text-sm border border-[#76777d]-variant/30">Tam Zamanlı</span>
<span className="bg-[#d3e4fe] text-[#45464d] px-2 py-1 rounded text-sm border border-[#76777d]-variant/30">React / Next.js</span>
<span className="bg-[#d3e4fe] text-[#45464d] px-2 py-1 rounded text-sm border border-[#76777d]-variant/30">TypeScript</span>
</div>
<p className=" text-[#45464d] line-clamp-2">AI destekli arayüz mimarilerinin geliştirilmesinden sorumlu olacak, React ekosistemine hakim uzman geliştirici arıyoruz.</p>
<div className="flex items-center justify-between mt-2 pt-4 border-t border-[#76777d]-variant">
<div className="flex items-center gap-1 text-[#45464d]">
<Icon name="location_on" />
<span className="text-sm">İstanbul, Beşiktaş</span>
</div>
<button className="bg-[#0051d5] text-[#ffffff] px-6 h-10 rounded-lg  hover:bg-[#0051d5]-container hover:text-[#ffffff]-container transition-all active:scale-95">Başvur</button>
</div>
</div>
<!-- Card 2 -->
<div className="bg-[#e5eeff]-lowest shadow-md rounded-xl p-6 border border-[#76777d]-variant hover:border-[#0051d5] transition-all flex flex-col gap-4 group">
<div className="flex justify-between items-start">
<div className="flex gap-4">
<div className="h-14 w-14 rounded-lg bg-[#e5eeff] border border-[#76777d]-variant flex items-center justify-center overflow-hidden">
<img className="w-10 h-10 object-contain" data-alt="A modern corporate logo for a financial technology startup. The emblem is a stylized infinity symbol morphing into a bar chart, rendered in vibrant teal and deep charcoal gray. The background is a flat light-gray surface. The design evokes a sense of dynamic growth, data precision, and professional financial management." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBeKd2UQFaPf7iugdaIKrdkBpKGMy9rBhPOEqI0RS-VQD9WAFRN2uV4PObaBpzwNFfmi0WqjbGChTH54r2zcvdXVoLiDXtZnKAV7EuNPpcSRjXHVAZYYA6htnZX2FFeLUdLWljat6uh6zPK20r3P5bCflicrCmbHiVS11Y3Rb_-xbRD7rCmtDxU8Dqnido5i3J-P-u0BNablac1sV5ZbUhdHg-dfzjhiE2bWJfmFZHct11i8vE_-mwL6KknG0yamSg63BgUTDIv5yg"/>
</div>
<div>
<h3 className=" text-base font-bold text-[#0b1c30] group-hover:text-[#0051d5] transition-colors">UX/UI Designer</h3>
<p className=" text-sm text-[#45464d]">FinFlow Analytics</p>
</div>
</div>
<div className="flex flex-col items-end gap-1">
<span className="bg-[#0051d5]-container text-[#ffffff]-container px-2 py-1 rounded-full text-sm font-bold flex items-center gap-1">
<Icon name="verified" />
                                92% Match
                            </span>
<span className="text-sm text-[#45464d] italic">Dün</span>
</div>
</div>
<div className="flex flex-wrap gap-1">
<span className="bg-[#d3e4fe] text-[#45464d] px-2 py-1 rounded text-sm border border-[#76777d]-variant/30">Hibrit</span>
<span className="bg-[#d3e4fe] text-[#45464d] px-2 py-1 rounded text-sm border border-[#76777d]-variant/30">Tam Zamanlı</span>
<span className="bg-[#d3e4fe] text-[#45464d] px-2 py-1 rounded text-sm border border-[#76777d]-variant/30">Figma</span>
<span className="bg-[#d3e4fe] text-[#45464d] px-2 py-1 rounded text-sm border border-[#76777d]-variant/30">SaaS Experience</span>
</div>
<p className=" text-[#45464d] line-clamp-2">Finansal verileri görselleştiren karmaşık dashboard projelerinde kullanıcı deneyimini yönetecek tasarımcılar arıyoruz.</p>
<div className="flex items-center justify-between mt-2 pt-4 border-t border-[#76777d]-variant">
<div className="flex items-center gap-1 text-[#45464d]">
<Icon name="location_on" />
<span className="text-sm">Ankara, Çankaya</span>
</div>
<button className="bg-[#0051d5] text-[#ffffff] px-6 h-10 rounded-lg  hover:bg-[#0051d5]-container hover:text-[#ffffff]-container transition-all active:scale-95">Başvur</button>
</div>
</div>
<!-- Card 3 -->
<div className="bg-[#e5eeff]-lowest shadow-md rounded-xl p-6 border border-[#76777d]-variant hover:border-[#0051d5] transition-all flex flex-col gap-4 group">
<div className="flex justify-between items-start">
<div className="flex gap-4">
<div className="h-14 w-14 rounded-lg bg-[#e5eeff] border border-[#76777d]-variant flex items-center justify-center overflow-hidden">
<img className="w-10 h-10 object-contain" data-alt="A professional minimalist logo for an artificial intelligence research lab. The icon is a brain-inspired node map with glowing connecting points, colored in shades of indigo and electric blue. The presentation is sleek, scientific, and authoritative, set against a dark-mode-ready translucent panel that suggests deep learning and future-ready technology." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqmPbkYMD2KU6Ng7sjCMqEr0HhBh44GD8FQR5vMd6pcA3Q6P3p5UvU59e4-CBZzJLrYplQTdrJcyrvYeePWSZcviEoj8f7iTXJ8LwLSL0k8-mtSe3I_Lsq_uZQQW_bq1TV3KlK1EIK2OtsEMyir9nZyvOuhKkrFtfczgRS0eZOzZoow34885FQ5gtaDhwE2OBxAae7x_FRy28Ydd2zquetM8lag2pD_c6wmicmTw0y-qAES_JnqjPKI9pBxvBfDWVBj4ooaMg9xsM"/>
</div>
<div>
<h3 className=" text-base font-bold text-[#0b1c30] group-hover:text-[#0051d5] transition-colors">AI Research Engineer</h3>
<p className=" text-sm text-[#45464d]">CogniCore Labs</p>
</div>
</div>
<div className="flex flex-col items-end gap-1">
<span className="bg-[#0051d5]-container text-[#ffffff]-container px-2 py-1 rounded-full text-sm font-bold flex items-center gap-1">
<Icon name="verified" />
                                85% Match
                            </span>
<span className="text-sm text-[#45464d] italic">3 gün önce</span>
</div>
</div>
<div className="flex flex-wrap gap-1">
<span className="bg-[#d3e4fe] text-[#45464d] px-2 py-1 rounded text-sm border border-[#76777d]-variant/30">Ofis</span>
<span className="bg-[#d3e4fe] text-[#45464d] px-2 py-1 rounded text-sm border border-[#76777d]-variant/30">Proje Bazlı</span>
<span className="bg-[#d3e4fe] text-[#45464d] px-2 py-1 rounded text-sm border border-[#76777d]-variant/30">Python</span>
<span className="bg-[#d3e4fe] text-[#45464d] px-2 py-1 rounded text-sm border border-[#76777d]-variant/30">PyTorch</span>
</div>
<p className=" text-[#45464d] line-clamp-2">NLP ve büyük dil modelleri üzerine Ar-Ge projelerinde aktif rol alacak doktora seviyesinde veya deneyimli mühendisler.</p>
<div className="flex items-center justify-between mt-2 pt-4 border-t border-[#76777d]-variant">
<div className="flex items-center gap-1 text-[#45464d]">
<Icon name="location_on" />
<span className="text-sm">İstanbul, Sarıyer</span>
</div>
<button className="bg-[#0051d5] text-[#ffffff] px-6 h-10 rounded-lg  hover:bg-[#0051d5]-container hover:text-[#ffffff]-container transition-all active:scale-95">Başvur</button>
</div>
</div>
<!-- Card 4 -->
<div className="bg-[#e5eeff]-lowest shadow-md rounded-xl p-6 border border-[#76777d]-variant hover:border-[#0051d5] transition-all flex flex-col gap-4 group">
<div className="flex justify-between items-start">
<div className="flex gap-4">
<div className="h-14 w-14 rounded-lg bg-[#e5eeff] border border-[#76777d]-variant flex items-center justify-center overflow-hidden">
<img className="w-10 h-10 object-contain" data-alt="A vibrant and energetic logo for a creative marketing agency. The design features a stylized rocket ship taking off, leaving a trail of colorful gradient smoke in orange and magenta. The typography is bold and playful, conveying a sense of high-speed growth, creative disruption, and youthful ambition. The background is a clean white studio light." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCD8eLLbwFCV5hoNGBs4Ya-M29c3W3FiWz53p8alaaZjwhsVjzJJfiIAUSO5E2rDcxw4D0tJeAZWsjDtVb1q0N0bwN19t4glZnSw-rUp5iD0Hx9d7I1EgNiKIsGfNCSiRY6Xcsw4dIxnwrWjhuJ8S9XIwzG2WpP1gAqDOM62iztl9-H-Jv7YSt7N7pS8fC9-W0J9k1hYGbssDSZVARAmc41ROiv9wj50c1HY52cGNDaNB6zuY5qmCAbfpvnHbGP20AglYhE3jKQoCA"/>
</div>
<div>
<h3 className=" text-base font-bold text-[#0b1c30] group-hover:text-[#0051d5] transition-colors">Marketing Manager</h3>
<p className=" text-sm text-[#45464d]">Velocity Growth</p>
</div>
</div>
<div className="flex flex-col items-end gap-1">
<span className="bg-[#0051d5]-container text-[#ffffff]-container px-2 py-1 rounded-full text-sm font-bold flex items-center gap-1">
<Icon name="verified" />
                                78% Match
                            </span>
<span className="text-sm text-[#45464d] italic">1 hafta önce</span>
</div>
</div>
<div className="flex flex-wrap gap-1">
<span className="bg-[#d3e4fe] text-[#45464d] px-2 py-1 rounded text-sm border border-[#76777d]-variant/30">Uzaktan</span>
<span className="bg-[#d3e4fe] text-[#45464d] px-2 py-1 rounded text-sm border border-[#76777d]-variant/30">Tam Zamanlı</span>
<span className="bg-[#d3e4fe] text-[#45464d] px-2 py-1 rounded text-sm border border-[#76777d]-variant/30">Digital Marketing</span>
</div>
<p className=" text-[#45464d] line-clamp-2">Marka bilinirliğini artıracak, veri odaklı pazarlama stratejileri geliştirecek ve ekibi yönetecek vizyoner yönetici.</p>
<div className="flex items-center justify-between mt-2 pt-4 border-t border-[#76777d]-variant">
<div className="flex items-center gap-1 text-[#45464d]">
<Icon name="location_on" />
<span className="text-sm">İzmir, Konak</span>
</div>
<button className="bg-[#0051d5] text-[#ffffff] px-6 h-10 rounded-lg  hover:bg-[#0051d5]-container hover:text-[#ffffff]-container transition-all active:scale-95">Başvur</button>
</div>
</div>
</div>
<!-- Pagination -->
<div className="flex justify-center items-center gap-2 py-10">
<button className="h-10 w-10 flex items-center justify-center rounded-lg border border-[#76777d]-variant text-[#0b1c30] hover:bg-[#d3e4fe] transition-colors">
<Icon name="chevron_left" />
</button>
<button className="h-10 w-10 flex items-center justify-center rounded-lg bg-[#0051d5] text-[#ffffff] ">1</button>
<button className="h-10 w-10 flex items-center justify-center rounded-lg border border-[#76777d]-variant text-[#0b1c30] hover:bg-[#d3e4fe] transition-colors ">2</button>
<button className="h-10 w-10 flex items-center justify-center rounded-lg border border-[#76777d]-variant text-[#0b1c30] hover:bg-[#d3e4fe] transition-colors ">3</button>
<span className="px-2 text-[#45464d]">...</span>
<button className="h-10 w-10 flex items-center justify-center rounded-lg border border-[#76777d]-variant text-[#0b1c30] hover:bg-[#d3e4fe] transition-colors ">12</button>
<button className="h-10 w-10 flex items-center justify-center rounded-lg border border-[#76777d]-variant text-[#0b1c30] hover:bg-[#d3e4fe] transition-colors">
<Icon name="chevron_right" />
</button>
</div>
</main>