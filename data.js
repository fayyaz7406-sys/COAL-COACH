/* ============================================================
   COAL Coach — course content (teacher notes L1–L8)
   Hinglish + technical English, same flow as the guide:
   Definition → Working → Example → Exam Tip
   ============================================================ */
const COURSE = {

  topics: [
    /* ------------------------------------------------ 1 */
    {
      id: 'interrupts', num: 1, icon: 'bolt', lecture: 'Lecture 2',
      title: 'Interrupts (ISR)',
      blurb: 'Processor ko event ki turant intimation — context save, ISR, phir wahin se resume.',
      sections: [
        {
          h: 'Definition',
          body: `<p>Interrupt ek <strong>signal</strong> hota hai jo kisi device ya event ki taraf se processor ko bheja jata hai, taake processor apna current program temporarily rok kar pehle us event ko handle kare.</p>
<p>Jo special program is event ko handle karta hai usay <strong>ISR (Interrupt Service Routine)</strong> ya <strong>interrupt handler</strong> kehte hain.</p>
<div class="callout"><strong>Real-life example:</strong> Aap padhai kar rahe hain aur phone ring hota hai. Aap book mein page number yaad rakh kar (<em>context save</em>) call uthate hain (<em>ISR</em>). Call ke baad wapis usi page se padhai shuru kar dete hain (<em>context restore</em>).</div>`
        },
        {
          h: 'Interrupts kyun use hote hain?',
          body: `<p>Printer ya disk jaise devices processor se bohut slow hote hain. Agar processor har waqt un ka wait kare to wo idle baitha rahega. Interrupts ki wajah se processor apna kaam karta rehta hai, aur jab device ready ho jaye tab device khud processor ko bata deta hai. Is se <strong>efficiency barhti hai</strong>.</p>`
        },
        {
          h: 'Interrupt ki classes (Table 3.1)',
          body: `<div class="tbl-wrap"><table><thead><tr><th>Class</th><th>Kab aata hai</th></tr></thead><tbody>
<tr><td><strong>Program</strong></td><td>Program ke andar error — overflow, divide by zero</td></tr>
<tr><td><strong>Timer</strong></td><td>Processor ke internal timer se, regular intervals par</td></tr>
<tr><td><strong>I/O</strong></td><td>I/O controller se — operation complete ya error</td></tr>
<tr><td><strong>Hardware failure</strong></td><td>Power failure, memory parity error</td></tr>
</tbody></table></div>`
        },
        {
          h: 'Interrupt Cycle — exam ka sab important part',
          body: `<p>Har instruction execute hone ke baad, agle fetch se <strong>pehle</strong>, processor check karta hai ke koi interrupt pending hai ya nahi.</p>
<ol class="steps">
<li><strong>Koi interrupt nahi:</strong> agli instruction fetch hoti hai.</li>
<li><strong>Interrupt pending hai:</strong> current program suspend hota hai.</li>
<li><strong>Context save:</strong> PC aur baqi processor state stack mein save kiye jate hain.</li>
<li><strong>PC ← ISR ka address</strong> load hota hai aur ISR run hoti hai.</li>
<li><strong>Context restore</strong> hota hai aur program wahin se resume hota hai jahan ruka tha.</li>
</ol>
<div class="callout warn"><strong>Yaad rakhein:</strong> Context save karna zaroori hai — warna program resume nahi ho sakega.</div>`
        },
        {
          h: 'Multiple Interrupts',
          body: `<p>Agar ISR chal rahi ho aur doosra interrupt aa jaye, to do approaches hain:</p>
<div class="tbl-wrap"><table><thead><tr><th></th><th>Disable interrupts</th><th>Priority-based nesting</th></tr></thead><tbody>
<tr><td><strong>Idea</strong></td><td>Ek handle ho raha ho to naye interrupts ignore (pending) rahenge</td><td>Higher-priority interrupt, lower-priority ISR ko interrupt kar sakta hai</td></tr>
<tr><td><strong>Pros</strong></td><td>Simple, strictly sequential</td><td>Urgent device jaldi serve hota hai</td></tr>
<tr><td><strong>Cons</strong></td><td>Priority ka khayal nahi rakhta</td><td>Complex, stack chahiye hota hai</td></tr>
</tbody></table></div>
<p><strong>Notes ka example:</strong> Priorities — printer = 2, disk = 4, communications = 5.</p>
<ul class="clean">
<li><code>t = 10</code>: printer interrupt aaya → user program ki state stack mein gayi, printer ISR shuru.</li>
<li><code>t = 15</code>: communications interrupt aaya (priority 5 &gt; 2) → printer ISR ruki, uski state stack par push, communications ISR run.</li>
<li>Phir routines <strong>reverse order</strong> mein resume hoti hain: pehle printer ISR, phir user program.</li>
</ul>`
        },
        {
          h: 'Exam Tip',
          body: `<div class="callout tip"><strong>Exam Tip:</strong> "Explain interrupt cycle" aur "compare two approaches of multiple interrupts" bohut common questions hain. Table zaroor yaad karein — especially <em>context save → ISR → restore</em> ka sequence.</div>`
        }
      ],
      keypoints: [
        'Interrupt check: instruction ke baad, fetch se pehle',
        'Context save = PC + processor state',
        'ISR = Interrupt Service Routine',
        'Disable vs priority nesting: simple vs urgent-first'
      ],
      visual: {
        title: 'Interrupt cycle — step by step',
        scenarios: [
          {
            name: 'Simple interrupt cycle',
            steps: [
              { t: 'Normal execution', body: `<p>Processor user program ki instruction execute kar raha hai. Abhi koi interrupt pending nahi hai.</p><div class="flow"><span class="flow-node on">Fetch</span><span class="flow-arrow">→</span><span class="flow-node on">Decode</span><span class="flow-arrow">→</span><span class="flow-node on">Execute</span></div>` },
              { t: 'Interrupt check', body: `<p>Instruction execute hone ke baad, <strong>agle fetch se pehle</strong> processor interrupt line check karta hai.</p><div class="flow"><span class="flow-node on">Execute</span><span class="flow-arrow">→</span><span class="flow-node on">Check interrupt?</span><span class="flow-arrow">→</span><span class="flow-node">Fetch next</span></div>` },
              { t: 'Interrupt mil gaya', body: `<p>I/O controller ne signal bhej diya — device ready hai. Ab current program temporarily suspend hota hai.</p><div class="callout warn"><strong>Interrupt pending!</strong> Agli instruction fetch nahi hogi.</div>` },
              { t: 'Context save', body: `<p>PC (next instruction ka address) aur baqi processor state (flags, registers) <strong>stack par push</strong> kiye jate hain. Ye step sab se zaroori hai.</p><div class="flow"><span class="flow-node on">PC</span><span class="flow-arrow">→</span><span class="flow-node on">Stack</span><span class="flow-arrow">+</span><span class="flow-node on">Processor state</span></div>` },
              { t: 'ISR run', body: `<p>PC mein <strong>ISR ka starting address</strong> load hota hai aur processor interrupt handler chalata hai — yani device ko serve karta hai.</p><div class="flow"><span class="flow-node on">PC ← ISR address</span><span class="flow-arrow">→</span><span class="flow-node on">ISR execute</span></div>` },
              { t: 'Context restore & resume', body: `<p>ISR khatam hone par stack se purana PC aur state wapis load hote hain. Program <strong>waheen se resume</strong> hota hai jahan ruka tha — bilkul phone call ke baad padhai shuru karne ki tarah.</p><div class="flow"><span class="flow-node on">Restore PC</span><span class="flow-arrow">→</span><span class="flow-node on">Resume program</span></div>` }
            ]
          },
          {
            name: 'Priority nesting example',
            steps: [
              { t: 't = 10 — printer interrupt', body: `<p>Printer ne interrupt bheja (priority 2). User program ki state stack par save hoti hai aur printer ISR shuru hoti hai.</p><div class="flow"><span class="flow-node">User program</span><span class="flow-arrow">→</span><span class="flow-node on">Printer ISR (2)</span></div>` },
              { t: 't = 15 — communications aaya', body: `<p>Communications interrupt aaya jiski priority <strong>5</strong> hai — printer (2) se zyada. Priority scheme mein higher priority, lower ISR ko preempt kar sakta hai.</p><div class="callout tip"><strong>Disable approach</strong> mein ye interrupt sirf pending rehta, jaldi serve nahi hota.</div>` },
              { t: 'Printer ISR bhi save hoti hai', body: `<p>Printer ISR ki apni state bhi stack par push hoti hai (nesting ke liye stack zaroori hai). Ab communications ISR run kar rahi hai.</p><div class="flow"><span class="flow-node">User state</span><span class="flow-arrow">·</span><span class="flow-node">Printer state</span><span class="flow-arrow">→</span><span class="flow-node on">Comm ISR (5)</span></div>` },
              { t: 'Reverse order mein resume', body: `<p>Communications ISR khatam → printer ISR resume → phir user program. Stack LIFO ki tarah kaam karta hai.</p><div class="flow"><span class="flow-node on">Comm done</span><span class="flow-arrow">→</span><span class="flow-node on">Printer ISR</span><span class="flow-arrow">→</span><span class="flow-node on">User program</span></div>` }
            ]
          }
        ]
      }
    },

    /* ------------------------------------------------ 2 */
    {
      id: 'dma', num: 2, icon: 'swap', lecture: 'Lecture 3',
      title: 'Direct Memory Access (DMA)',
      blurb: 'I/O module seedha memory se read/write — processor sirf start aur end par.',
      sections: [
        {
          h: 'Definition',
          body: `<p>DMA ek technique hai jisme processor, I/O module ko authority de deta hai ke wo <strong>seedha main memory</strong> se read ya write kare, processor ke beech mein aaye baghair. Ye kaam <strong>DMA controller</strong> karta hai.</p>`
        },
        {
          h: 'DMA ki zaroorat kyun?',
          body: `<div class="tbl-wrap"><table><thead><tr><th>Method</th><th>Data kaun move karta hai</th><th>Problem</th></tr></thead><tbody>
<tr><td><strong>Programmed I/O</strong></td><td>Processor, word by word</td><td>Processor wait karta rehta hai, useful kaam nahi karta</td></tr>
<tr><td><strong>Interrupt-driven I/O</strong></td><td>Processor, device ready hone par</td><td>Har word processor se guzarta hai aur har word par interrupt</td></tr>
<tr><td><strong>DMA</strong></td><td>DMA controller, device ↔ memory</td><td>Processor sirf start aur end par involve — best solution</td></tr>
</tbody></table></div>
<div class="callout"><strong>Conclusion:</strong> DMA large block transfers (disk, network) ke liye best hai.</div>`
        },
        {
          h: 'DMA Controller ke Registers',
          body: `<ul class="clean">
<li><strong>Address register</strong> — memory mein transfer kahan se shuru hoga.</li>
<li><strong>Word count register</strong> — kitne words transfer karne hain.</li>
<li><strong>Data register</strong> — transit mein data ka temporary holding.</li>
<li><strong>Control/Status register</strong> — read/write direction, start, done.</li>
</ul>`
        },
        {
          h: 'DMA ki working (step by step)',
          body: `<ol class="steps">
<li>Processor DMA controller ko batata hai: operation (read/write), device address, starting memory address aur word count. Phir processor doosre kaam par chala jata hai.</li>
<li>DMA controller <strong>bus request</strong> karta hai.</li>
<li>Processor current bus cycle ke end par <strong>bus grant</strong> karta hai aur address, data, control lines chhor deta hai.</li>
<li>Data device aur memory ke beech direct transfer hota hai. Controller address bus par address rakhta hai, read/write command deta hai, address register <strong>increment</strong> aur word count <strong>decrement</strong> karta hai.</li>
<li>Ye tab tak repeat hota hai jab tak <code>word count = 0</code> na ho jaye.</li>
<li>Controller bus release karta hai aur processor ko <strong>interrupt</strong> bhejta hai ke transfer complete ho gaya.</li>
<li>Processor status check karke data ke saath aage barhta hai.</li>
</ol>
<div class="callout tip"><strong>Exam line:</strong> Processor sirf step 1 aur step 7 mein involve hota hai — baqi sab controller karta hai.</div>`
        },
        {
          h: 'Cycle Stealing aur Burst Mode',
          body: `<p>Processor aur DMA controller ek hi bus share karte hain, to ek waqt mein sirf ek use kar sakta hai.</p>
<ul class="clean">
<li><strong>Cycle stealing:</strong> controller processor ke bus cycles ke darmiyan ek ek cycle le leta hai. Processor sirf apne agle bus access se pehle thora pause karta hai — <em>context save nahi karta</em>.</li>
<li><strong>Burst mode:</strong> controller bus ko tab tak hold rakhta hai jab tak poora block transfer na ho jaye.</li>
</ul>`
        },
        {
          h: 'DMA vs Interrupt',
          body: `<div class="tbl-wrap"><table><thead><tr><th></th><th>Interrupt</th><th>DMA</th></tr></thead><tbody>
<tr><td><strong>Processor involvement</strong></td><td>ISR run karta hai</td><td>Sirf start aur end par</td></tr>
<tr><td><strong>Context saved?</strong></td><td>Haan (PC aur state)</td><td>Nahi</td></tr>
<tr><td><strong>Granularity</strong></td><td>Instructions ke darmiyan</td><td>Bus cycles ke darmiyan</td></tr>
<tr><td><strong>Best for</strong></td><td>Chhote, occasional transfers</td><td>Bade block transfers</td></tr>
</tbody></table></div>`
        },
        {
          h: 'Model Exam Answer',
          body: `<div class="callout purple"><strong>Answer:</strong> DMA is a technique where an I/O module reads or writes main memory directly without going through the processor. The processor starts the transfer by giving the DMA controller the device, memory address and word count. The controller takes control of the bus, transfers the data (usually by cycle stealing) and interrupts the processor when done. This frees the processor and greatly improves efficiency for large block transfers.</div>`
        }
      ],
      keypoints: [
        'Processor: sirf start + end',
        'Cycle stealing = bus cycle ke beech, no context save',
        'Burst = poora block tak bus hold',
        'Word count = 0 → done interrupt'
      ],
      visual: {
        title: 'DMA transfer — bus ownership',
        scenarios: [
          {
            name: '7-step transfer',
            steps: [
              { t: 'Step 1 — Processor setup', body: `<p>Processor controller ko deta hai: <strong>read/write, device address, memory address, word count</strong>. Phir apne kaam par chala jata hai.</p><div class="flow"><span class="flow-node on">CPU</span><span class="flow-arrow">→</span><span class="flow-node on">DMA controller</span></div>` },
              { t: 'Step 2 — Bus request', body: `<p>Controller ko bus chahiye — wo <strong>bus request</strong> signal bhejta hai.</p><div class="flow"><span class="flow-node on">DMA</span><span class="flow-arrow">→ BR →</span><span class="flow-node on">CPU</span></div>` },
              { t: 'Step 3 — Bus grant', body: `<p>CPU current bus cycle ke <strong>end</strong> par grant karta hai aur address/data/control lines chhor deta hai.</p><div class="callout tip"><strong>Bus ab controller ke paas:</strong> CPU apne internal kaam karta rehta hai.</div>` },
              { t: 'Step 4 — Direct transfer', body: `<p>Device ↔ memory seedha. Har word par address register <strong>increment</strong>, word count <strong>decrement</strong>.</p><div class="flow"><span class="flow-node on">I/O device</span><span class="flow-arrow">↔</span><span class="flow-node on">Memory</span></div>` },
              { t: 'Step 5 — Repeat', body: `<p>Tab tak repeat jab tak <code>word count = 0</code>. Ye loop poora controller chalata hai — CPU free hai.</p>` },
              { t: 'Step 6 — Done interrupt', body: `<p>Controller bus release karta hai aur CPU ko <strong>interrupt</strong> bhejta hai: transfer complete.</p><div class="flow"><span class="flow-node on">DMA</span><span class="flow-arrow">→ IRQ →</span><span class="flow-node on">CPU</span></div>` },
              { t: 'Step 7 — CPU finish', body: `<p>CPU status check karta hai aur data ke saath aage barhta hai. <strong>Sirf yahin aur step 1 par CPU involve tha.</strong></p>` }
            ]
          },
          {
            name: 'Cycle stealing vs Burst',
            steps: [
              { t: 'Shared bus problem', body: `<p>CPU aur DMA ek hi bus share karte hain. Ek waqt mein sirf ek kaam kar sakta hai — isliye bus arbitration zaroori hai.</p>` },
              { t: 'Cycle stealing', body: `<p>Controller CPU ke bus cycles ke <strong>darmiyan</strong> ek ek cycle leta hai. CPU thora pause hota hai, par <strong>context save nahi</strong> hota.</p><div class="flow"><span class="flow-node on">CPU</span><span class="flow-arrow">|</span><span class="flow-node on">DMA</span><span class="flow-arrow">|</span><span class="flow-node on">CPU</span><span class="flow-arrow">|</span><span class="flow-node on">DMA</span></div>` },
              { t: 'Burst mode', body: `<p>Controller bus ko tab tak hold rakhta hai jab tak poora block transfer na ho jaye. Tez hai, par CPU lambe waqt tak bus use nahi kar paata.</p><div class="flow"><span class="flow-node">CPU</span><span class="flow-arrow">|</span><span class="flow-node on" style="min-width:180px">DMA — full block — DMA — DMA</span><span class="flow-arrow">|</span><span class="flow-node">CPU</span></div>` },
              { t: 'Exam comparison', body: `<p><strong>Cycle stealing:</strong> chhote pauses, CPU slow but active. <strong>Burst:</strong> ek lamba pause, fastest block transfer. Dono mein context save nahi hota — ye interrupt se farq hai.</p>` }
            ]
          }
        ]
      }
    },

    /* ------------------------------------------------ 3 */
    {
      id: 'cache', num: 3, icon: 'layers', lecture: 'Lectures 5, 6, 7',
      title: 'Cache Memory (Physical, Virtual, Victim)',
      blurb: 'Fast memory between CPU aur RAM — hit/miss, mapping, replacement aur performance numbers.',
      sections: [
        {
          h: 'Definition aur Concept',
          body: `<p>Cache ek chhoti aur bohut fast memory hoti hai jo processor aur slow main memory ke beech hoti hai. Ye main memory ke kuch hisson ki <strong>copies</strong> rakhti hai.</p>
<ul class="clean">
<li><strong>Hit:</strong> processor ko jo word chahiye wo cache mein mil gaya — system bus use nahi hoti.</li>
<li><strong>Miss:</strong> word cache mein nahi mila — poora <strong>block</strong> main memory se cache mein load hota hai.</li>
</ul>
<div class="callout"><strong>Example:</strong> Library (main memory) se kitaab nikaal kar apni study table (cache) par rakh lete hain. Table par ho → foran mil gaya (hit). Na ho → library jana pada (miss).</div>`
        },
        {
          h: 'Physical vs Virtual (Logical) Cache',
          body: `<p>Virtual memory mein programs <strong>logical (virtual) addresses</strong> use karte hain aur <strong>MMU</strong> unhein physical addresses mein translate karta hai.</p>
<div class="tbl-wrap"><table><thead><tr><th></th><th>Logical (Virtual) Cache</th><th>Physical Cache</th></tr></thead><tbody>
<tr><td><strong>Kya store karta hai</strong></td><td>Virtual addresses</td><td>Physical addresses</td></tr>
<tr><td><strong>Position</strong></td><td>MMU se <strong>pehle</strong></td><td>MMU ke <strong>baad</strong></td></tr>
<tr><td><strong>Speed</strong></td><td>Faster — translation ka wait nahi</td><td>Translation ke baad access</td></tr>
</tbody></table></div>`
        },
        {
          h: 'Mapping Functions',
          body: `<p>Cache lines, main memory ke blocks se kam hoti hain, isliye mapping chahiye.</p>
<div class="tbl-wrap"><table><thead><tr><th></th><th>Direct</th><th>Associative</th><th>Set Associative</th></tr></thead><tbody>
<tr><td><strong>Idea</strong></td><td>Har block sirf ek specific line mein</td><td>Block kisi bhi line mein</td><td>Block ek set ki kisi bhi line mein</td></tr>
<tr><td><strong>Formula</strong></td><td><code>i = j mod m</code></td><td>koi nahi</td><td><code>set = j mod v</code></td></tr>
<tr><td><strong>Address fields</strong></td><td>Tag (s−r), Line (r), Word (w)</td><td>Tag (s), Word (w)</td><td>Tag (s−d), Set (d), Word (w)</td></tr>
<tr><td><strong>Drawback</strong></td><td>Conflict misses</td><td>Har line ka tag compare — costly</td><td>Dono ka compromise</td></tr>
</tbody></table></div>
<div class="callout tip"><strong>Summary:</strong> Direct simple hai par conflict misses; associative flexible hai par hardware mehnga; set associative dono ka balance hai.</div>`
        },
        {
          h: 'Numerical Example (exam mein aata hai)',
          body: `<p><strong>Given:</strong> 24-bit address, 4-byte blocks, 16K lines.</p>
<ul class="clean">
<li><strong>Direct:</strong> Word = 2 bits (4 = 2²), Line = 14 bits (16K = 2¹⁴), <strong>Tag = 24 − 14 − 2 = 8 bits</strong>.</li>
<li><strong>Associative:</strong> Tag = 24 − 2 = <strong>22 bits</strong>, Word = 2 bits.</li>
<li><strong>2-way set associative:</strong> Sets = 16K / 2 = 8K = 2¹³ → Set = 13 bits, Word = 2 bits, <strong>Tag = 24 − 13 − 2 = 9 bits</strong>.</li>
</ul>
<div class="callout tip"><strong>Khud try karein:</strong> Topic ke <em>Lab</em> tab me ye numbers badal kar answer check karein.</div>`
        },
        {
          h: 'Replacement Algorithms',
          body: `<p>Direct mapping mein choice nahi hoti. Baaqi mein replacement algorithm chahiye — hardware mein implement hota hai.</p>
<ul class="clean">
<li><strong>LRU (Least Recently Used):</strong> jo block sab se zyada der se use nahi hua — sab se popular aur effective.</li>
<li><strong>FIFO:</strong> sab se purana block replace.</li>
<li><strong>LFU (Least Frequently Used):</strong> jo sab se kam reference hua — har line par counter.</li>
</ul>`
        },
        {
          h: 'Write Policy',
          body: `<ul class="clean">
<li><strong>Write through:</strong> har write cache aur main memory <em>dono</em> mein. Simple, par memory traffic zyada aur bottleneck ban sakta hai.</li>
<li><strong>Write back:</strong> sirf cache update; block memory mein tab likha jata hai jab replace ho. Memory writes kam, par circuitry complex aur I/O ko cache ke through jana parta hai.</li>
</ul>`
        },
        {
          h: 'Victim Cache',
          body: `<p><strong>Direct-mapped L1</strong> ke conflict misses kam karne ke liye use hota hai. Ye <strong>fully associative</strong> hota hai, <strong>4 se 16 lines</strong> rakhta hai aur L1 aur next level ke beech hota hai.</p>
<p>L1 se nikaale gaye (victim) blocks isme rakhe jate hain, taake dobara zaroorat par jaldi mil jayein.</p>`
        },
        {
          h: 'Cache Performance (Lecture 7)',
          body: `<div class="formula">t_ave = h × C + (1 − h) × M &nbsp; [h = hit ratio, C = cache time, M = memory time]</div>
<p><strong>Example:</strong> C = 1, M = 17, h = 0.9 → t = 0.9(1) + 0.1(17) = 0.9 + 1.7 = <strong>2.6 cycles</strong>.</p>
<div class="formula">Two-level: t_ave = h₁·C₁ + (1−h₁)·h₂·C₂ + (1−h₁)(1−h₂)·M</div>
<p><strong>CPI example (memory = 500 cycles):</strong></p>
<div class="tbl-wrap"><table><thead><tr><th>Case</th><th>Calculation</th><th>CPI</th></tr></thead><tbody>
<tr><td>No cache</td><td>1 + 500</td><td><strong>501</strong></td></tr>
<tr><td>L1 only (h₁ = 0.95)</td><td>1 + 0.05 × 500</td><td><strong>26</strong></td></tr>
<tr><td>L1 + L2 (h₂ = 0.90, L2 = 25)</td><td>1 + 0.05(25 + 0.10 × 500)</td><td><strong>4.75</strong></td></tr>
</tbody></table></div>
<div class="callout"><strong>Speedup from L1</strong> = 501 / 26 ≈ <strong>19.3 times</strong>.</div>`
        }
      ],
      keypoints: [
        'Hit → bus nahi; Miss → poora block load',
        'Direct i = j mod m; Set = j mod v',
        'Tag = address bits − index bits − word bits',
        'LRU best replacement; Write back kam memory writes',
        't = h·C + (1−h)·M'
      ],
      visual: {
        title: 'Cache hit / miss flow',
        scenarios: [
          {
            name: 'Hit vs Miss',
            steps: [
              { t: 'CPU requests a word', body: `<p>Processor kisi address par word maangta hai. Cache apne tags check karti hai.</p><div class="flow"><span class="flow-node on">CPU</span><span class="flow-arrow">→</span><span class="flow-node on">Cache tags</span></div>` },
              { t: 'HIT', body: `<p>Word <strong>cache mein mil gaya</strong>. Data foran CPU ko mil jata hai — <strong>system bus use nahi hoti</strong>.</p><div class="flow"><span class="flow-node on">Cache</span><span class="flow-arrow">→</span><span class="flow-node on">CPU ✓ fast</span></div><div class="callout tip"><strong>Hit ratio h</strong> jitna zyada, average access time utna kam.</div>` },
              { t: 'MISS', body: `<p>Word nahi mila. Ab poora <strong>block</strong> main memory se cache mein load hota hai — sirf ek word nahi.</p><div class="flow"><span class="flow-node on">Main memory</span><span class="flow-arrow">→ block →</span><span class="flow-node on">Cache</span><span class="flow-arrow">→</span><span class="flow-node on">CPU</span></div>` },
              { t: 'Replacement', body: `<p>Agar target line occupied hai to replacement algorithm chalta hai: <strong>LRU</strong> (sab se purana unused), FIFO ya LFU. Direct mapping mein choice nahi — block seedha usi line par jata hai <code>i = j mod m</code>.</p>` },
              { t: 'Victim cache (direct L1)', body: `<p>Jiska block L1 se nikaala gaya (victim), wo chhoti <strong>fully associative</strong> cache (4–16 lines) mein rakha jata hai. Conflict miss par wahin se jaldi mil jata hai.</p><div class="flow"><span class="flow-node on">L1 evict</span><span class="flow-arrow">→</span><span class="flow-node on">Victim cache</span><span class="flow-arrow">→</span><span class="flow-node on">L2</span></div>` }
            ]
          },
          {
            name: 'Virtual vs Physical',
            steps: [
              { t: 'Program virtual address use karta hai', body: `<p>Program ko pata hi nahi ki data physical memory mein kahan hai — wo <strong>virtual address</strong> deta hai.</p><div class="flow"><span class="flow-node on">Program</span><span class="flow-arrow">→ VA</span><span class="flow-node on">?</span></div>` },
              { t: 'Logical (virtual) cache', body: `<p>Cache <strong>MMU se pehle</strong> hai — virtual addresses se hi lookup karta hai. Translation ka wait nahi, isliye <strong>faster</strong>.</p><div class="flow"><span class="flow-node on">VA</span><span class="flow-arrow">→</span><span class="flow-node on">Virtual cache</span><span class="flow-arrow">→</span><span class="flow-node on">MMU</span></div>` },
              { t: 'Physical cache', body: `<p>Cache <strong>MMU ke baad</strong> hai — pehle VA → PA translation, phir cache access. Thoda slow par simple design.</p><div class="flow"><span class="flow-node on">VA</span><span class="flow-arrow">→</span><span class="flow-node on">MMU</span><span class="flow-arrow">→ PA →</span><span class="flow-node on">Physical cache</span></div>` }
            ]
          }
        ]
      },
      lab: 'cache'
    },

    /* ------------------------------------------------ 4 */
    {
      id: 'registers', num: 4, icon: 'cpu', lecture: 'Lecture 8',
      title: 'Register Operation',
      blurb: 'Basic computer ke 8 registers, common bus aur S2S1S0 se register transfer.',
      sections: [
        {
          h: 'Basic Computer ke Registers',
          body: `<div class="tbl-wrap"><table><thead><tr><th>Register</th><th>Size</th><th>Kaam</th></tr></thead><tbody>
<tr><td><strong>DR</strong> — Data Register</td><td>16 bits</td><td>Memory se aaya operand hold karta hai</td></tr>
<tr><td><strong>AR</strong> — Address Register</td><td>12 bits</td><td>Memory address hold karta hai</td></tr>
<tr><td><strong>AC</strong> — Accumulator</td><td>16 bits</td><td>Main processor register, results yahan aate hain</td></tr>
<tr><td><strong>IR</strong> — Instruction Register</td><td>16 bits</td><td>Current instruction hold karta hai</td></tr>
<tr><td><strong>PC</strong> — Program Counter</td><td>12 bits</td><td>Agli instruction ka address</td></tr>
<tr><td><strong>TR</strong> — Temporary Register</td><td>16 bits</td><td>Temporary data</td></tr>
<tr><td><strong>INPR</strong></td><td>8 bits</td><td>Input register</td></tr>
<tr><td><strong>OUTR</strong></td><td>8 bits</td><td>Output register</td></tr>
</tbody></table></div>
<p>Ek 1-bit register <strong>E (carry/extend)</strong> bhi hota hai.</p>`
        },
        {
          h: 'Common Bus System',
          body: `<ul class="clean">
<li>Saray 7 registers aur memory ek <strong>common bus</strong> se connected hote hain.</li>
<li>Selection lines <code>S2 S1 S0</code> decide karti hain ke kaun sa register bus par data dega.</li>
<li><strong>AR/PC</strong> 16-bit bus par aate hain to upar ke 4 bits <code>0</code> hote hain; receive karte waqt sirf neeche ke 12 bits lete hain.</li>
<li><strong>INPR</strong> bus par data de sakta hai, magar <strong>OUTR</strong> sirf receive kar sakta hai (<code>INPR → AC</code>, <code>AC → OUTR</code>).</li>
<li>Memory ka address input hamesha <strong>AR</strong> se connected hota hai.</li>
<li>AC ke inputs adder/logic circuit se aate hain — ek set AC khud se (complement, shift), doosra DR se (add, AND).</li>
</ul>`
        },
        {
          h: 'Register Transfer (core idea)',
          body: `<p>Register-to-register move ka matlab: <strong>source register</strong> ko <code>S2 S1 S0</code> se select karo (wo bus par aa jata hai), aur <strong>destination</strong> ka <code>LD (load)</code> input enable karo.</p>
<div class="callout tip"><strong>Example — AR ← PC (T0 par):</strong> <code>S2 S1 S0 = 010</code> set karke PC ko bus par rakhte hain aur AR ka LD enable karte hain. PC ki value AR mein copy ho jati hai.</div>`
        },
        {
          h: 'Register Movement Summary',
          body: `<div class="tbl-wrap"><table><thead><tr><th>Register</th><th>Instructions mein role</th></tr></thead><tbody>
<tr><td><strong>PC</strong></td><td>T0 par AR mein, T1 par increment</td></tr>
<tr><td><strong>AR</strong></td><td>Har memory read/write ke liye address hold</td></tr>
<tr><td><strong>IR</strong></td><td>T1 par instruction receive; parts decoder, AR aur I ko feed</td></tr>
<tr><td><strong>DR</strong></td><td>Memory operand, phir AC (LDA) ya adder (ADD)</td></tr>
<tr><td><strong>AC</strong></td><td>LDA: DR; ADD: AC+DR; shift: shifted value; STA: store</td></tr>
<tr><td><strong>E</strong></td><td>ADD ka carry out; CIR/CIL mein AC ke saath rotate</td></tr>
</tbody></table></div>`
        }
      ],
      keypoints: [
        'AR/PC = 12 bits; AC/DR/IR/TR = 16 bits',
        'S2 S1 S0 = 010 → PC par bus',
        'INPR → AC → OUTR (OUTR sirf receive)',
        'Memory address input hamesha AR se'
      ],
      visual: {
        title: 'Common bus — register transfer',
        scenarios: [
          {
            name: 'Bus se transfer',
            steps: [
              { t: 'Common bus', body: `<p>Saat registers aur memory ek hi bus se judte hain. Ek waqt mein sirf <strong>ek source</strong> bus par data deta hai.</p><div class="flow"><span class="flow-node on">DR</span><span class="flow-node on">AR</span><span class="flow-node on">AC</span><span class="flow-node on">IR</span><span class="flow-node on">PC</span><span class="flow-node on">TR</span><span class="flow-node on">INPR</span></div>` },
              { t: 'Selection lines S2 S1 S0', body: `<p>3 selection lines 8 combinations deti hain — ek register (ya memory) select karne ke liye.</p>` },
              { t: 'Example: AR ← PC', body: `<p><code>S2 S1 S0 = 010</code> → PC bus par aata hai. AR ka <code>LD = 1</code> → value AR mein copy. Ye T0 par hota hai.</p><div class="flow"><span class="flow-node on">PC (010)</span><span class="flow-arrow">→ bus →</span><span class="flow-node on">AR (LD=1)</span></div>` },
              { t: 'Destination load', body: `<p>Sirf selection kaafi nahi — destination ka <strong>LD (load) input</strong> bhi enable karna parta hai. Tabhi data register mein zayad hota hai.</p>` },
              { t: 'Special cases', body: `<p><strong>AR/PC</strong> receive karte waqt sirf 12 bits lete hain. <strong>INPR</strong> bus par data de sakta hai par <strong>OUTR</strong> sirf receive karta hai — <code>INPR → AC → OUTR</code>.</p>` }
            ]
          }
        ]
      },
      specialVisual: 'bus'
    },

    /* ------------------------------------------------ 5 */
    {
      id: 'buses', num: 5, icon: 'route', lecture: 'Lecture 3',
      title: 'Buses',
      blurb: 'Data, Address aur Control bus — QPI layers, phit/flit aur PCI/PCIe.',
      sections: [
        {
          h: 'Definition',
          body: `<p>Bus ek <strong>shared communication pathway</strong> hai jo computer ke components (CPU, memory, I/O) ko connect karta hai.</p>`
        },
        {
          h: 'Teen Types ki Bus',
          body: `<div class="tbl-wrap"><table><thead><tr><th>Bus</th><th>Kaam</th></tr></thead><tbody>
<tr><td><strong>Data bus</strong></td><td>Data carry karti hai. Lines ki tadaad uski <strong>width</strong> hai (32, 64, 128...) — performance ka key factor.</td></tr>
<tr><td><strong>Address bus</strong></td><td>Source ya destination identify karti hai. Iski width <strong>maximum memory capacity</strong> decide karti hai.</td></tr>
<tr><td><strong>Control bus</strong></td><td>Shared lines ka access control. <em>Timing signals</em> data ki validity batate hain, <em>command signals</em> operation batate hain.</td></tr>
</tbody></table></div>
<div class="callout"><strong>Example:</strong> 12-bit address bus = <code>2¹² = 4096</code> locations (4K words) address ho sakti hain.</div>
<p>Address bus mein <strong>high-order bits</strong> module select karte hain aur <strong>low-order bits</strong> module ke andar ki location. Bus par data bhejne ke liye module ko pehle bus obtain karna parta hai (<strong>arbitration</strong>), phir transfer hota hai.</p>`
        },
        {
          h: 'Point-to-Point Interconnect — QPI (2008)',
          body: `<p>Shared bus ki jagah ab general-purpose computers mein <strong>point-to-point links</strong> use hote hain.</p>
<ul class="clean">
<li>Direct pairwise connections — <strong>arbitration ki zaroorat nahi</strong>.</li>
<li><strong>Packetized transfer</strong> — control headers aur error codes ke saath.</li>
</ul>
<div class="tbl-wrap"><table><thead><tr><th>QPI Layer</th><th>Kaam</th></tr></thead><tbody>
<tr><td><strong>Physical</strong></td><td>Wires aur signaling. Unit <strong>phit = 20 bits</strong></td></tr>
<tr><td><strong>Link</strong></td><td>Flow control aur error control. Unit <strong>flit = 80 bits</strong> (72 payload + 8 CRC)</td></tr>
<tr><td><strong>Routing</strong></td><td>Packet ka path decide karti hai</td></tr>
<tr><td><strong>Protocol</strong></td><td>Packet unit of transfer; cache coherency protocol yahan chalta hai</td></tr>
</tbody></table></div>`
        },
        {
          h: 'PCI aur PCIe',
          body: `<ul class="clean">
<li><strong>PCI:</strong> high-bandwidth, processor-independent bus.</li>
<li><strong>PCIe:</strong> point-to-point scheme jo bus-based PCI ko replace karne ke liye hai.</li>
<li><strong>Root complex</strong> processor aur memory ko PCIe switch fabric se connect karta hai.</li>
<li>PCIe <strong>lane bidirectional</strong> hoti hai (QPI lane sirf ek direction). Ports par <strong>1, 4, 6, 16 ya 32 lanes</strong>.</li>
<li>3 layers: <strong>physical, data link, transaction</strong>.</li>
<li>Transaction layer <strong>TLPs</strong> banata hai. Zyada tar <strong>split transactions</strong> (request → completion). <strong>Posted</strong> transactions mein reply nahi aata.</li>
</ul>`
        },
        {
          h: 'Exam Tip',
          body: `<div class="callout tip"><strong>Exam Tip:</strong> Teen buses ka table, QPI ki 4 layers aur <strong>phit (20 bits) vs flit (80 bits)</strong> ka farq zaroor yaad rakhein. PCIe lane bidirectional — QPI lane directional.</div>`
        }
      ],
      keypoints: [
        'Address bus width → max memory capacity',
        '12-bit → 4096 locations',
        'QPI: Physical, Link, Routing, Protocol',
        'Phit 20 bits; Flit 80 = 72 + 8 CRC',
        'PCIe bidirectional lanes; split vs posted TLPs'
      ],
      visual: {
        title: 'Bus se transfer aur layers',
        scenarios: [
          {
            name: 'Shared bus transaction',
            steps: [
              { t: 'Koi device bus chahata hai', body: `<p>CPU, memory ya I/O module — sab ek hi shared bus se judte hain. Ek waqt mein sirf ek driver.</p>` },
              { t: 'Arbitration', body: `<p>Module pehle bus obtain karta hai (arbitration). Tabhi wo address/data/control lines drive kar sakta hai.</p><div class="flow"><span class="flow-node on">Request</span><span class="flow-arrow">→</span><span class="flow-node on">Grant</span><span class="flow-arrow">→</span><span class="flow-node on">Drive bus</span></div>` },
              { t: 'Address + Control', body: `<p><strong>Address bus</strong> source/destination batata hai — high-order bits module select, low-order bits andar ki location. <strong>Control bus</strong> read/write command deta hai.</p>` },
              { t: 'Data + timing', body: `<p><strong>Data bus</strong> par data jata hai. Control bus ke timing signals batate hain ke data kab valid hai.</p>` },
              { t: 'Width ka matlab', body: `<p>12-bit address bus → <code>2¹² = 4096</code> locations. 64-bit data bus → ek cycle mein 8 bytes. Width badhne par performance/capacity dono badhte hain.</p>` }
            ]
          },
          {
            name: 'QPI ke 4 layers',
            steps: [
              { t: 'Physical layer', body: `<p>Wires aur signaling. Chhoti unit <strong>phit = 20 bits</strong>.</p><div class="flow"><span class="flow-node on">Phit · 20 bits</span></div>` },
              { t: 'Link layer', body: `<p>Flow control + error control. <strong>Flit = 80 bits</strong> = 72-bit payload + 8-bit CRC.</p><div class="flow"><span class="flow-node on">72 payload</span><span class="flow-arrow">+</span><span class="flow-node on">8 CRC</span><span class="flow-arrow">=</span><span class="flow-node on">80-bit flit</span></div>` },
              { t: 'Routing layer', body: `<p>Packet ka <strong>path</strong> decide karti hai — kis point-to-point link se aage jana hai.</p>` },
              { t: 'Protocol layer', body: `<p>Packet transfer ki unit yahan define hoti hai. <strong>Cache coherency protocol</strong> yahin chalta hai.</p>` },
              { t: 'PCIe se compare', body: `<p>PCIe point-to-point hai, <strong>3 layers</strong> (physical, data link, transaction), lanes <strong>bidirectional</strong>. QPI lane sirf ek direction — isliye PCIe ne PCI ko replace kiya.</p>` }
            ]
          }
        ]
      },
      lab: 'bus'
    },

    /* ------------------------------------------------ 6 */
    {
      id: 'instructions', num: 6, icon: 'code', lecture: 'Lecture 8',
      title: 'Instructions aur unki Working',
      blurb: '16-bit format, fetch–decode, MOV/ADD/Shift ke micro-operations aur hex decoding.',
      sections: [
        {
          h: 'Instruction ka structure',
          body: `<p>Instruction ek <strong>binary code</strong> hai jo microoperations ki sequence specify karta hai. Ye <strong>opcode</strong> (kya karna hai) aur operand/address part par mushtamil hota hai.</p>
<p>Basic computer mein 16-bit instruction:</p>
<ul class="clean">
<li><code>IR(15) = I</code> → mode bit</li>
<li><code>IR(12–14) = 3-bit opcode</code></li>
<li><code>IR(0–11) = 12-bit address</code></li>
</ul>
<p><strong>Direct addressing (I = 0):</strong> address field mein data ka address. <strong>Indirect (I = 1):</strong> address field mein wo location jahan data ka asal address likha hai.</p>`
        },
        {
          h: 'Instruction Formats',
          body: `<div class="tbl-wrap"><table><thead><tr><th>Type</th><th>Pehchaan</th><th>Baqi bits</th></tr></thead><tbody>
<tr><td><strong>Memory-reference</strong></td><td>Opcode 000 se 110</td><td>1-bit I + 12-bit address</td></tr>
<tr><td><strong>Register-reference</strong></td><td>Opcode 111, I = 0 (hex <code>7xxx</code>)</td><td>AC par operation/test</td></tr>
<tr><td><strong>Input-output</strong></td><td>Opcode 111, I = 1 (hex <code>Fxxx</code>)</td><td>I/O operation/test</td></tr>
</tbody></table></div>`
        },
        {
          h: 'Fetch aur Decode (har instruction ke liye common)',
          body: `<p>Timing signals <code>T0, T1, T2...</code> sequence counter (SC) se aate hain.</p>
<div class="tbl-wrap"><table><thead><tr><th>Timing</th><th>Micro-operation</th><th>Matlab</th></tr></thead><tbody>
<tr><td><strong>T0</strong></td><td><code>AR ← PC</code></td><td>Instruction ka address AR mein</td></tr>
<tr><td><strong>T1</strong></td><td><code>IR ← M[AR], PC ← PC+1</code></td><td>Instruction IR mein, PC increment</td></tr>
<tr><td><strong>T2</strong></td><td><code>Decode IR(12-14), AR ← IR(0-11), I ← IR(15)</code></td><td>Decode, address AR mein, mode bit save</td></tr>
</tbody></table></div>
<p>Opcode ek <strong>3-to-8 decoder</strong> mein jata hai jo <code>D0</code> se <code>D7</code> outputs deta hai.</p>
<div class="tbl-wrap"><table><thead><tr><th>Condition</th><th>Type</th><th>Action</th></tr></thead><tbody>
<tr><td><code>D7 = 0, I = 1</code></td><td>Memory-reference, indirect</td><td>T3: <code>AR ← M[AR]</code> (asal address)</td></tr>
<tr><td><code>D7 = 0, I = 0</code></td><td>Memory-reference, direct</td><td>T3: kuch nahi</td></tr>
<tr><td><code>D7 = 1, I = 0</code></td><td>Register-reference</td><td>T3 par execute, <code>r = D7 I' T3</code></td></tr>
<tr><td><code>D7 = 1, I = 1</code></td><td>Input-output</td><td>T3 par execute, <code>p = D7 I T3</code></td></tr>
</tbody></table></div>
<p><strong>Memory-reference instructions T4 se execute hoti hain.</strong></p>`
        },
        {
          h: 'MOV (Data Movement): LDA aur STA',
          body: `<p>Basic computer mein ek single MOV instruction nahi hoti — data movement <strong>LDA</strong> aur <strong>STA</strong> se hoti hai.</p>
<p><strong>LDA</strong> (memory → AC), opcode 010, decoder <code>D2</code>:</p>
<div class="tbl-wrap"><table><thead><tr><th>Timing</th><th>Micro-operation</th></tr></thead><tbody>
<tr><td><code>D2 T4</code></td><td><code>DR ← M[AR]</code></td></tr>
<tr><td><code>D2 T5</code></td><td><code>AC ← DR, SC ← 0</code></td></tr>
</tbody></table></div>
<p><strong>STA</strong> (AC → memory), opcode 011, decoder <code>D3</code>:</p>
<div class="tbl-wrap"><table><thead><tr><th>Timing</th><th>Micro-operation</th></tr></thead><tbody>
<tr><td><code>D3 T4</code></td><td><code>M[AR] ← AC, SC ← 0</code></td></tr>
</tbody></table></div>
<div class="callout"><strong>DR kyun zaroori?</strong> Memory ki value pehle ek register mein aani chahiye, tabhi wo AC ke adder/logic circuit mein enter ho sakti hai.</div>
<p><strong>Example:</strong> Instruction <code>2940</code> (LDA direct, address 940). Agar <code>M[940] = 0007</code>: T4 par <code>DR ← 0007</code>, T5 par <code>AC ← 0007</code>.</p>`
        },
        {
          h: 'ADD',
          body: `<p>Opcode 001, decoder <code>D1</code>. Hex: <code>1xxx</code> (direct) ya <code>9xxx</code> (indirect).</p>
<div class="tbl-wrap"><table><thead><tr><th>Timing</th><th>Micro-operation</th><th>Explanation</th></tr></thead><tbody>
<tr><td>T0–T2</td><td>Fetch aur decode</td><td><code>D1 = 1</code> ho jata hai</td></tr>
<tr><td>T3</td><td><code>AR ← M[AR]</code></td><td>Sirf I = 1 par — indirect address</td></tr>
<tr><td><code>D1 T4</code></td><td><code>DR ← M[AR]</code></td><td>Operand DR mein</td></tr>
<tr><td><code>D1 T5</code></td><td><code>AC ← AC + DR, E ← Cout, SC ← 0</code></td><td>Add; carry E mein</td></tr>
</tbody></table></div>
<p><strong>Worked example:</strong> <code>1940</code> (ADD direct, 940), <code>AC = 0005</code>, <code>M[940] = 0003</code>.</p>
<ul class="clean"><li>T4: <code>DR ← 0003</code></li><li>T5: <code>AC ← 0005 + 0003 = 0008, E = 0</code></li></ul>`
        },
        {
          h: 'SHIFT: CIR aur CIL',
          body: `<p>Register-reference instructions (opcode 111, I = 0) — <code>r = D7 I' T3</code>, pehchan bits <code>B0–B11</code> se.</p>
<div class="tbl-wrap"><table><thead><tr><th>Instruction</th><th>Hex</th><th>Control</th><th>Micro-operation (T3 par)</th></tr></thead><tbody>
<tr><td><strong>CIR</strong> (circulate right)</td><td><code>7080</code></td><td><code>r B7</code></td><td><code>AC ← shr AC, AC(15) ← E, E ← AC(0), SC ← 0</code></td></tr>
<tr><td><strong>CIL</strong> (circulate left)</td><td><code>7040</code></td><td><code>r B6</code></td><td><code>AC ← shl AC, AC(0) ← E, E ← AC(15), SC ← 0</code></td></tr>
</tbody></table></div>
<ul class="clean">
<li><strong>CIR:</strong> AC = 0003 (…0011), E = 0 → purana AC(0)=1 E mein, purana E=0 AC(15) mein → <strong>AC = 0001, E = 1</strong>.</li>
<li><strong>CIL:</strong> AC = 8001, E = 0 → purana AC(15)=1 E mein, purana E=0 AC(0) mein → <strong>AC = 0002, E = 1</strong>.</li>
</ul>
<div class="callout tip"><strong>AC + E milkar ek 17-bit circular ring</strong> ki tarah behave karte hain.</div>`
        },
        {
          h: 'Memory-reference Instruction Table',
          body: `<div class="tbl-wrap"><table><thead><tr><th>Instr.</th><th>Opcode</th><th>Decoder</th><th>Hex (I=0 / I=1)</th><th>Execution</th></tr></thead><tbody>
<tr><td><strong>AND</strong></td><td>000</td><td>D0</td><td>0xxx / 8xxx</td><td><code>AC ← AC AND DR</code></td></tr>
<tr><td><strong>ADD</strong></td><td>001</td><td>D1</td><td>1xxx / 9xxx</td><td><code>AC ← AC + DR, E ← Cout</code></td></tr>
<tr><td><strong>LDA</strong></td><td>010</td><td>D2</td><td>2xxx / Axxx</td><td><code>AC ← DR</code></td></tr>
<tr><td><strong>STA</strong></td><td>011</td><td>D3</td><td>3xxx / Bxxx</td><td><code>M[AR] ← AC</code></td></tr>
<tr><td><strong>BUN</strong></td><td>100</td><td>D4</td><td>4xxx / Cxxx</td><td><code>PC ← AR</code></td></tr>
<tr><td><strong>BSA</strong></td><td>101</td><td>D5</td><td>5xxx / Dxxx</td><td><code>M[AR] ← PC, AR ← AR+1, PC ← AR</code></td></tr>
<tr><td><strong>ISZ</strong></td><td>110</td><td>D6</td><td>6xxx / Exxx</td><td><code>DR ← M[AR]+1</code>, store back, agar 0 to <code>PC ← PC+1</code></td></tr>
</tbody></table></div>`
        },
        {
          h: 'Hex Decode Practice (exam style)',
          body: `<ul class="clean">
<li><code>7080</code>: opcode 111, I = 0 → register-reference, B7 set → <strong>CIR</strong>.</li>
<li><code>1940</code>: I = 0, opcode 001 → <strong>ADD direct</strong>, address 940.</li>
<li><code>B940</code>: B = 1011 → I = 1, opcode 011 → <strong>STA indirect</strong>, address 940.</li>
</ul>
<div class="callout tip"><strong>Lab tab</strong> me koi bhi 4-digit hex daal kar uska decoded result dekhein — exam se pehle practice ho jayegi.</div>`
        }
      ],
      keypoints: [
        'IR(15)=I, IR(12-14)=opcode, IR(0-11)=address',
        'T0: AR←PC · T1: IR←M[AR], PC←PC+1 · T2: decode',
        'LDA=D2, STA=D3, ADD=D1 (T4/T5)',
        'CIR=7080, CIL=7040',
        'r = D7 I’ T3 (7xxx) · p = D7 I T3 (Fxxx)'
      ],
      visual: {
        title: 'Fetch → Decode → Execute',
        scenarios: [
          {
            name: 'ADD direct (1940)',
            steps: [
              { t: 'T0 — AR ← PC', body: `<p>Agli instruction ka address PC se AR mein jata hai.</p><div class="flow"><span class="flow-node on">PC</span><span class="flow-arrow">→</span><span class="flow-node on">AR</span></div>` },
              { t: 'T1 — IR ← M[AR], PC ← PC+1', body: `<p>Instruction memory se IR mein aati hai aur PC agle address par badh jata hai.</p><div class="flow"><span class="flow-node on">M[AR]</span><span class="flow-arrow">→</span><span class="flow-node on">IR</span><span class="flow-arrow">·</span><span class="flow-node on">PC+1</span></div>` },
              { t: 'T2 — Decode', body: `<p><code>IR(12-14) = 001</code> → opcode ADD → <strong>D1 = 1</strong>. <code>IR(0-11) = 940</code> → AR. <code>I = 0</code> → direct, T3 skip.</p>` },
              { t: 'T4 — DR ← M[AR]', body: `<p>Operand (M[940] = 0003) pehle DR mein aata hai — kyunki adder mein seedha memory data nahi jata.</p><div class="flow"><span class="flow-node on">M[940]=0003</span><span class="flow-arrow">→</span><span class="flow-node on">DR</span></div>` },
              { t: 'T5 — AC ← AC + DR', body: `<p><code>AC = 0005 + 0003 = 0008</code>, carry out <code>E = 0</code>, <code>SC ← 0</code> (sequence counter reset → agla fetch).</p><div class="callout tip"><strong>Direct</strong> tha isliye T3 nahi aaya. Indirect hota to T3 par <code>AR ← M[AR]</code> hota.</div>` }
            ]
          },
          {
            name: 'STA aur Shift',
            steps: [
              { t: 'STA (D3) — T4', body: `<p><code>M[AR] ← AC, SC ← 0</code>. Ek hi micro-operation — DR ki zaroorat nahi kyunki AC se seedha memory mein likhna hai.</p><div class="flow"><span class="flow-node on">AC</span><span class="flow-arrow">→</span><span class="flow-node on">M[AR]</span></div>` },
              { t: 'CIR (7080) — r B7', body: `<p><code>AC ← shr AC, AC(15) ← E, E ← AC(0), SC ← 0</code>. AC=0003, E=0 → <strong>AC=0001, E=1</strong>.</p>` },
              { t: 'CIL (7040) — r B6', body: `<p><code>AC ← shl AC, AC(0) ← E, E ← AC(15), SC ← 0</code>. AC=8001, E=0 → <strong>AC=0002, E=1</strong>.</p>` },
              { t: '17-bit ring', body: `<p><strong>AC (16 bits) + E (1 bit)</strong> milkar circular ring banate hain — CIR/CIL mein bit kahin lost nahi hoti.</p>` }
            ]
          }
        ]
      },
      lab: 'instruction'
    },

    /* ------------------------------------------------ 7 */
    {
      id: 'arithmetic', num: 7, icon: 'binary', lecture: 'Lectures 4, 5',
      title: 'Binary Arithmetic',
      blurb: 'Twos complement, overflow, Booth multiplication aur restoring division — with worked steps.',
      sections: [
        {
          h: 'Integer Representation',
          body: `<p>Computer mein sirf 0 aur 1 hote hain, to negative numbers ke liye leftmost bit <strong>sign bit</strong> hoti hai (0 = positive, 1 = negative).</p>
<ul class="clean">
<li><strong>Sign-magnitude:</strong> baqi n−1 bits magnitude. Drawbacks: add/subtract mein sign check karna parta hai aur <strong>do zeros</strong> hote hain (+0 aur −0).</li>
<li><strong>Twos complement:</strong> addition aur subtraction asaan — isliye processors mein almost universal.</li>
<li><strong>Range (n bits):</strong> <code>−2^(n−1)</code> se <code>2^(n−1) − 1</code>. 8 bits: <strong>−128 se +127</strong>.</li>
<li><strong>Sign extension:</strong> nayi bits ko sign bit ki copies se fill karo (positive → 0s, negative → 1s).</li>
</ul>`
        },
        {
          h: 'Negation (Twos Complement nikalna)',
          body: `<ol class="steps">
<li>Har bit complement karo (sign bit samet).</li>
<li>Result mein <strong>1 add</strong> karo.</li>
</ol>
<p><strong>Example:</strong> +18 = <code>00010010</code> → complement <code>11101101</code> → +1 = <code>11101110</code> = <strong>−18</strong>.</p>
<div class="callout warn"><strong>Special cases:</strong> 0 ki negation 0 hi aati hai. <code>−128 (10000000)</code> ki negation phir <code>−128</code> aati hai (galat), kyunki <code>+128</code> 8 bits mein fit nahi hota.</div>`
        },
        {
          h: 'Addition aur Overflow',
          body: `<p>Addition unsigned addition ki tarah hoti hai aur top bit ka <strong>carry out ignore</strong> hota hai.</p>
<div class="callout tip"><strong>Overflow rule:</strong> Agar do positive ya do negative numbers add karne par result ka sign <strong>ulta</strong> aa jaye to overflow hua hai.</div>
<p><strong>Example (8 bits):</strong> 100 + 50 = 150, range se bahar.</p>
<div class="bits-box"><div class="bits">01100100 &nbsp;(+100)<br>00110010 &nbsp;(+50)<br>--------<br>10010110 &nbsp;(negative!)</div></div>
<p>Do positives ka sum negative aaya → <strong>overflow</strong>.</p>`
        },
        {
          h: 'Subtraction',
          body: `<p>Subtrahend ka twos complement lo aur minuend mein add kar do:</p>
<div class="formula">A − B = A + (−B)</div>`
        },
        {
          h: 'Unsigned Multiplication',
          body: `<p>Registers: <strong>M</strong> (multiplicand), <strong>Q</strong> (multiplier), <strong>A</strong> (shuru mein 0), <strong>C</strong> (1-bit carry).</p>
<ol class="steps">
<li>Agar <code>Q0 = 1</code> → <code>A = A + M</code> (carry C mein). Phir <code>C, A, Q</code> ko together <strong>right shift</strong>.</li>
<li>Agar <code>Q0 = 0</code> → sirf shift.</li>
<li>n baar repeat — 2n-bit product <code>A aur Q</code> mein milta hai.</li>
</ol>
<p>Negative multiplicand par ye method fail ho jata hai → <strong>Booth’s algorithm</strong>.</p>`
        },
        {
          h: "Booth’s Algorithm",
          body: `<p><code>Q−1</code> ek extra bit hai jo Q ke right mein, shuru mein <code>0</code>, aur hamesha wo bit hold karti hai jo abhi Q se shift out hui. Har cycle mein <code>Q0 Q−1</code> dekhte hain:</p>
<div class="tbl-wrap"><table><thead><tr><th>Q0 Q−1</th><th>Matlab</th><th>Action</th></tr></thead><tbody>
<tr><td><code>1 0</code></td><td>1s ki run ki shuruaat</td><td><code>A = A − M</code>, phir shift</td></tr>
<tr><td><code>0 1</code></td><td>1s ki run ka end</td><td><code>A = A + M</code>, phir shift</td></tr>
<tr><td><code>0 0</code></td><td>0s ki run</td><td>Sirf shift</td></tr>
<tr><td><code>1 1</code></td><td>1s ki run ka beech</td><td>Sirf shift</td></tr>
</tbody></table></div>
<p>Shift <strong>arithmetic right shift</strong> hota hai (A, Q, Q−1 saath; A ka sign bit copy hota hai).</p>
<div class="callout"><strong>Fayda:</strong> positive aur negative dono par kaam karta hai, aur 1s ka block sirf ek subtraction + ek addition leta hai. Maslan <code>3 = 0011 = +4 − 1</code>.</div>`
        },
        {
          h: 'Worked Example: 7 × 3',
          body: `<p><code>M = 0111, Q = 0011</code> (4-bit). Initial: <code>A = 0000, Q−1 = 0</code>.</p>
<div class="tbl-wrap"><table class="table-mono"><thead><tr><th>Cycle</th><th>Q0 Q−1</th><th>Action</th><th>A</th><th>Q</th><th>Q−1</th></tr></thead><tbody>
<tr><td>Initial</td><td>—</td><td>—</td><td>0000</td><td>0011</td><td>0</td></tr>
<tr><td>1</td><td>1 0</td><td>A = A − M = 1001, shift</td><td>1100</td><td>1001</td><td>1</td></tr>
<tr><td>2</td><td>1 1</td><td>Shift</td><td>1110</td><td>0100</td><td>1</td></tr>
<tr><td>3</td><td>0 1</td><td>A = A + M = 0101, shift</td><td>0010</td><td>1010</td><td>0</td></tr>
<tr><td>4</td><td>0 0</td><td>Shift</td><td>0001</td><td>0101</td><td>0</td></tr>
</tbody></table></div>
<p>Result (A + Q) = <code>0001 0101</code> = 16 + 4 + 1 = <strong>21 ✓</strong>.</p>`
        },
        {
          h: 'Restoring Division',
          body: `<p><strong>M</strong> = divisor, <strong>Q</strong> = dividend, <strong>A = 0</strong>. Har step mein:</p>
<ol class="steps">
<li>A aur Q ko <strong>left shift</strong> karo.</li>
<li><code>A = A − M</code>.</li>
<li>Agar A negative nahi → <code>Q0 = 1</code>.</li>
<li>Agar A negative hai → <code>Q0 = 0</code> aur M wapis add karke A ko <strong>restore</strong> karo.</li>
<li>n steps ke baad quotient <strong>Q</strong> mein, remainder <strong>A</strong> mein.</li>
</ol>
<p><strong>Example: 7 ÷ 3</strong> — <code>M = 0011, Q = 0111, A = 0000</code></p>
<div class="tbl-wrap"><table class="table-mono"><thead><tr><th>Step</th><th>Shift ke baad (A, Q)</th><th>A − M</th><th>Action</th><th>A, Q</th></tr></thead><tbody>
<tr><td>1</td><td>0000, 1110</td><td>negative</td><td>Q0=0, restore</td><td>0000, 1110</td></tr>
<tr><td>2</td><td>0001, 1100</td><td>negative</td><td>Q0=0, restore</td><td>0001, 1100</td></tr>
<tr><td>3</td><td>0011, 1000</td><td>0000</td><td>Q0=1</td><td>0000, 1001</td></tr>
<tr><td>4</td><td>0001, 0010</td><td>negative</td><td>Q0=0, restore</td><td>0001, 0010</td></tr>
</tbody></table></div>
<p>Quotient <code>0010 = 2</code>, remainder <code>0001 = 1</code> → <strong>7 ÷ 3 = 2 remainder 1 ✓</strong>.</p>
<div class="callout"><strong>Negative numbers:</strong> magnitudes divide karo, end mein sign fix karo —<br><code>sign(R) = sign(dividend)</code><br><code>sign(Q) = sign(dividend) × sign(divisor)</code><br>Example: −7 ÷ 2 → Q = −3, R = −1.</div>`
        }
      ],
      keypoints: [
        'Range n-bit: −2^(n−1) … 2^(n−1)−1',
        'Negation: complement + 1',
        'Overflow: same-sign inputs, opposite-sign result',
        'Booth: 10 → A−M, 01 → A+M, 00/11 → shift',
        'Division: sign(R)=sign(dividend), sign(Q)=sign(D)×sign(V)'
      ],
      visual: {
        title: 'Booth vs Restoring — flow',
        scenarios: [
          {
            name: "Booth's multiplier",
            steps: [
              { t: 'Setup', body: `<p><code>A = 0000, Q = multiplier, Q−1 = 0, M = multiplicand</code>. n cycles chalte hain.</p>` },
              { t: 'Dekho Q0 Q−1', body: `<p><code>10</code> → run shuru → <strong>A = A − M</strong><br><code>01</code> → run khatam → <strong>A = A + M</strong><br><code>00 / 11</code> → sirf shift.</p>` },
              { t: 'Arithmetic right shift', body: `<p><code>A, Q, Q−1</code> ko saath right shift — A ka sign bit dobara copy hota hai. Ye signed numbers ke liye zaroori hai.</p><div class="flow"><span class="flow-node on">A</span><span class="flow-arrow">→</span><span class="flow-node on">Q</span><span class="flow-arrow">→</span><span class="flow-node on">Q−1</span></div>` },
              { t: 'Result', body: `<p>n cycles ke baad <code>A Q</code> milkar 2n-bit product hai. <code>7 × 3 = 0001 0101 = 21</code>.</p>` },
              { t: 'Farq kya?', body: `<p>Simple unsigned multiplication negative multiplicand par fail hota hai. Booth dono signs par kaam karta hai aur 1s ke block ko ek hi add/subtract mein handle karta hai.</p>` }
            ]
          },
          {
            name: 'Restoring division',
            steps: [
              { t: 'Setup', body: `<p><code>A = 0, Q = dividend, M = divisor</code>. Magnitudes par kaam karte hain.</p>` },
              { t: 'Left shift', body: `<p><code>A aur Q</code> ko ek bit left shift — Q ka leftmost bit A mein aata hai.</p><div class="flow"><span class="flow-node on">A</span><span class="flow-arrow">←</span><span class="flow-node on">Q</span></div>` },
              { t: 'A = A − M', body: `<p>Subtract karo. Agar result <strong>negative nahi</strong> → <code>Q0 = 1</code> (bit set). Agar <strong>negative</strong> → <code>Q0 = 0</code> aur M wapis add karke restore.</p>` },
              { t: 'n steps ke baad', body: `<p>Quotient <strong>Q</strong>, remainder <strong>A</strong>. <code>7 ÷ 3 → Q=2, A=1</code>.</p>` },
              { t: 'Signs fix karo', body: `<p>Negative input tha to end mein: <code>sign(R) = sign(dividend)</code>, <code>sign(Q) = sign(D) × sign(V)</code>. Example <code>−7 ÷ 2 → −3, −1</code>.</p>` }
            ]
          }
        ]
      },
      lab: 'arithmetic'
    }
  ],

  /* ---------------- Question bank ---------------- */
  questions: [
    { id:'q01', topic:'interrupts', q:'Interrupt kya hai?', o:['Processor ko bheja gaya signal jisse wo event temporarily handle kare','Ek type ki cache memory','Address bus ka ek bit','Ek assignment operator'], a:0, why:'Interrupt ek signal hai — device/event processor ko batata hai ke pehle isko handle karo.' },
    { id:'q02', topic:'interrupts', q:'ISR ka full form kya hai?', o:['Interrupt Service Routine','Internal System Register','Instruction Set Register','Interrupt Status Request'], a:0, why:'ISR = Interrupt Service Routine — event handle karne wala special program.' },
    { id:'q03', topic:'interrupts', q:'Processor interrupt kab check karta hai?', o:['Har instruction execute hone ke baad, agle fetch se pehle','Sirf program shuru hone par','Har clock cycle ke end par bus grant karte waqt','Cache miss par hi'], a:0, why:'Interrupt cycle har instruction ke baad, agli fetch se pehle hota hai.' },
    { id:'q04', topic:'interrupts', q:'Context save mein kya save hota hai?', o:['PC aur processor state','Sirf AC register','Poora main memory','Sirf cache lines'], a:0, why:'PC + baqi processor state stack par save hote hain taake resume ho sake.' },
    { id:'q05', topic:'interrupts', q:'Slow I/O devices ke liye interrupt ka main fayda?', o:['Processor wait nahi karta, apna kaam karta rehta hai','Data bus ki width badh jati hai','Memory capacity badhti hai','Clock fast ho jata hai'], a:0, why:'Device ready hone par khud batati hai — processor idle wait se bachta hai.' },
    { id:'q06', topic:'interrupts', q:'Timer interrupt kahan se aata hai?', o:['Processor ke internal timer se','Printer se','Disk controller se','Power supply se'], a:0, why:'Timer class processor ke internal timer se regular intervals par aati hai.' },
    { id:'q07', topic:'interrupts', q:'"Disable interrupts" approach ka nuksan kya hai?', o:['Priority ka khayal nahi rakhta','Stack chahiye hota hai','Bohut slow hai','ISR nahi chal paati'], a:0, why:'Simple hai par urgent high-priority device ko jaldi serve nahi karta.' },
    { id:'q08', topic:'interrupts', q:'Notes ke example me t=15 par kaunsa interrupt aaya tha?', o:['Communications (priority 5)','Printer (priority 2)','Disk (priority 4)','Timer'], a:0, why:'t=15 par communications aaya, jiski priority 5 > printer ki 2 thi.' },
    { id:'q09', topic:'interrupts', q:'Priority nesting me interrupted routines kaise resume hoti hain?', o:['Reverse order (LIFO stack)','Jis order me aayi usi order me','Sirf highest priority wali hi','Random order'], a:0, why:'Stack LIFO ki tarah — pehle communications, phir printer, phir user program.' },
    { id:'q10', topic:'interrupts', q:'Agar context save na karein to kya hoga?', o:['Program resume nahi ho sakta','ISR fast chalegi','Bus grant nahi hoga','Cache flush ho jayegi'], a:0, why:'Bina saved PC/state ke wahin se wapis aana impossible hai.' },

    { id:'q11', topic:'dma', q:'DMA mein data kaun move karta hai?', o:['DMA controller','Processor, word by word','ALU','Cache memory'], a:0, why:'DMA controller device aur memory ke beech seedha data transfer karta hai.' },
    { id:'q12', topic:'dma', q:'Processor DMA transfer mein kab involve hota hai?', o:['Sirf start aur end par','Har word par','Har bus cycle par','Kabhi nahi'], a:0, why:'Setup aur completion interrupt — bas ye do jagah CPU involve hai.' },
    { id:'q13', topic:'dma', q:'Word count register ka kaam kya hai?', o:['Kitne words transfer karne hain','Memory ka starting address','Device ka naam','Read/write direction'], a:0, why:'Word count decrement hota hai — zero hone par transfer complete.' },
    { id:'q14', topic:'dma', q:'Cycle stealing kya hai?', o:['Controller CPU ke bus cycles ke beech ek cycle leta hai, context save nahi karta','Controller poora block hold karta hai','CPU apna context save karta hai','Memory controller bus tod deta hai'], a:0, why:'Chhote pauses, lekin context save nahi — yahi DMA ka interrupt se farq hai.' },
    { id:'q15', topic:'dma', q:'Burst mode kya karta hai?', o:['Poora block transfer tak bus hold rakhta hai','Ek-ek word ke liye bus chhodta hai','Processor ko har word par interrupt karta hai','Cache ko flush karta hai'], a:0, why:'Burst me controller bus tab tak rakhta hai jab tak poora block na ho jaye.' },
    { id:'q16', topic:'dma', q:'DMA kiske liye best hai?', o:['Bade block transfers (disk, network)','Chhote occasional transfers','Sirf register moves','Sirf cache hits'], a:0, why:'Setup cost ek baar — isliye bade blocks me efficiency zyada.' },
    { id:'q17', topic:'dma', q:'DMA vs interrupt — kaunsa sahi hai?', o:['DMA mein context save nahi hota; interrupt mein hota hai','Dono mein context save hota hai','DMA mein har word par ISR chalti hai','Interrupt mein bus cycles steal hote hain'], a:0, why:'Interrupt: instruction-level + context save. DMA: bus-cycle-level, no context save.' },
    { id:'q18', topic:'dma', q:'Bus grant kab hota hai?', o:['Current bus cycle ke end par','Turant request ke saath hi','Har instruction ke baad','Cache miss par'], a:0, why:'CPU apna current bus cycle khatam karke hi bus chhodta hai.' },
    { id:'q19', topic:'dma', q:'Transfer complete hone par DMA controller kya karta hai?', o:['Bus release karke CPU ko interrupt bhejta hai','CPU ka context save karta hai','Word count Increase karta hai','Memory format karta hai'], a:0, why:'Step 6 — done interrupt CPU ko batata hai ke data ready hai.' },

    { id:'q20', topic:'cache', q:'Cache hit ka matlab?', o:['Word cache mein mil gaya, system bus use nahi hoti','Word memory mein nahi mila','Block replace hua','Tag compare fail hua'], a:0, why:'Hit par data foran milta hai — memory bus nahi jati.' },
    { id:'q21', topic:'cache', q:'Logical (virtual) cache kahan hoti hai?', o:['MMU se pehle','MMU ke baad','Memory ke baad','Bus ke bahar'], a:0, why:'Virtual cache translation se pehle lookup karti hai — isliye faster.' },
    { id:'q22', topic:'cache', q:'Direct mapping ka formula kya hai?', o:['i = j mod m','set = j mod v','i = j × m','i = m mod j'], a:0, why:'Direct me block j sirf line i = j mod m par jata hai.' },
    { id:'q23', topic:'cache', q:'24-bit address, 4-byte block, 16K lines — direct mapping me tag bits?', o:['8','14','2','10'], a:0, why:'Word=2, Line=14 → Tag = 24−14−2 = 8 bits.' },
    { id:'q24', topic:'cache', q:'Upar wale example me 2-way set associative tag bits?', o:['9','8','13','22'], a:0, why:'Sets = 16K/2 = 8K = 2¹³ → Tag = 24−13−2 = 9 bits.' },
    { id:'q25', topic:'cache', q:'Fully associative cache me tag bits?', o:['22','8','9','14'], a:0, why:'Index bits nahi — Tag = 24−2 = 22 bits.' },
    { id:'q26', topic:'cache', q:'Conflict misses kis mapping me zyada hote hain?', o:['Direct mapping','Fully associative','Two-way set associative','Victim cache'], a:0, why:'Direct me har block ki ek hi jagah hai — isliye conflict.' },
    { id:'q27', topic:'cache', q:'LRU kya replace karta hai?', o:['Jo block sab se der se use nahi hua','Jo sab se purana load hua','Jo sab se kam reference hua','Random block'], a:0, why:'LRU = Least Recently Used; FIFO purana, LFU kam-frequency replace karta hai.' },
    { id:'q28', topic:'cache', q:'Write back policy kya hai?', o:['Sirf cache update; memory par tab likha jab block replace ho','Har write cache aur memory dono mein','Sirf memory mein likha, cache ignore','Write operation band kar deti hai'], a:0, why:'Write through dono mein likhta hai; write back sirf replace par memory mein.' },
    { id:'q29', topic:'cache', q:'Victim cache ka kaam kya hai?', o:['Direct-mapped L1 ke conflict misses kam karna','Memory capacity badhanna','MMU replacement karna','Write traffic badhanna'], a:0, why:'Chhoti fully-associated cache (4–16 lines) L1 aur next level ke beech.' },
    { id:'q30', topic:'cache', q:'C=1, M=17, h=0.9 → average access time?', o:['2.6 cycles','1.7 cycles','18 cycles','0.9 cycles'], a:0, why:'0.9(1) + 0.1(17) = 0.9 + 1.7 = 2.6 cycles.' },
    { id:'q31', topic:'cache', q:'Memory 500 cycles, L1 hit 0.95 — L1 only CPI?', o:['26','501','25','4.75'], a:0, why:'1 + 0.05 × 500 = 26.' },
    { id:'q32', topic:'cache', q:'L1 (h=0.95) + L2 (h2=0.90, 25 cycles), memory 500 — CPI?', o:['4.75','26','501','75'], a:0, why:'1 + 0.05(25 + 0.10×500) = 1 + 0.05(75) = 4.75.' },

    { id:'q33', topic:'registers', q:'AR (Address Register) ka size kya hai?', o:['12 bits','16 bits','8 bits','1 bit'], a:0, why:'AR aur PC 12-bit hote hain; DR, AC, IR, TR 16-bit; INPR/OUTR 8-bit.' },
    { id:'q34', topic:'registers', q:'Agli instruction ka address kis register mein hota hai?', o:['PC','AR','DR','TR'], a:0, why:'Program Counter (PC) agli instruction ka address rakhta hai.' },
    { id:'q35', topic:'registers', q:'AR ← PC ke liye S2 S1 S0 kya hoga?', o:['010','001','100','111'], a:0, why:'PC ko bus par select karne ke liye 010 — aur AR ka LD enable.' },
    { id:'q36', topic:'registers', q:'INPR aur OUTR ke baare mein sahi kya hai?', o:['INPR bus par data deta hai; OUTR sirf receive karta hai','Dono sirf receive karte hain','Dono bus par data dete hain','OUTR bus par data deta hai'], a:0, why:'INPR → AC → OUTR — output register sirf receive karta hai.' },
    { id:'q37', topic:'registers', q:'Memory ka address input hamesha kis se connected hai?', o:['AR se','PC se','DR se','AC se'], a:0, why:'Har memory read/write ke liye address AR se hi jata hai.' },

    { id:'q38', topic:'buses', q:'Address bus ki width kya decide karti hai?', o:['Maximum memory capacity','Data transfer speed ka matra','Clock frequency','Instruction count'], a:0, why:'n-bit address bus → 2ⁿ addressable locations.' },
    { id:'q39', topic:'buses', q:'12-bit address bus kitni locations address kar sakta hai?', o:['4096','1024','2048','8192'], a:0, why:'2¹² = 4096 locations (4K words).' },
    { id:'q40', topic:'buses', q:'QPI ka phit kitna bada hota hai?', o:['20 bits','80 bits','72 bits','8 bits'], a:0, why:'Physical layer ki unit phit = 20 bits.' },
    { id:'q41', topic:'buses', q:'QPI flit kya hai?', o:['80 bits = 72 payload + 8 CRC','20 bits signal unit','64-bit data word','12-bit address'], a:0, why:'Link layer ka flit 80 bits — 72 payload aur 8 CRC.' },
    { id:'q42', topic:'buses', q:'QPI ki kitni layers hoti hain?', o:['4','3','2','5'], a:0, why:'Physical, Link, Routing, Protocol — 4 layers.' },
    { id:'q43', topic:'buses', q:'PCIe aur QPI lanes me farq?', o:['PCIe lane bidirectional; QPI lane sirf ek direction','QPI bidirectional; PCIe sirf ek direction','Dono bidirectional','Dono sirf ek direction'], a:0, why:'PCIe lanes bidirectional hoti hain; QPI lane directional.' },
    { id:'q44', topic:'buses', q:'Control bus ke timing signals kya batate hain?', o:['Data kab valid hai','Data ka size','Memory capacity','Device ka naam'], a:0, why:'Timing signals validity batate hain; command signals operation batate hain.' },

    { id:'q45', topic:'instructions', q:'Basic computer ki 16-bit instruction me I bit kahan hai?', o:['IR(15)','IR(12-14)','IR(0-11)','IR(8)'], a:0, why:'IR(15) = I (mode), IR(12–14) = opcode, IR(0–11) = address.' },
    { id:'q46', topic:'instructions', q:'Opcode kitne bits ka hota hai?', o:['3 bits','1 bit','12 bits','16 bits'], a:0, why:'IR(12–14) — 3-bit opcode, 3-to-8 decoder ko jata hai.' },
    { id:'q47', topic:'instructions', q:'Fetch cycle me T1 par kya hota hai?', o:['IR ← M[AR], PC ← PC+1','AR ← PC','Decode opcode','AC ← AC + DR'], a:0, why:'T0: AR←PC; T1: IR←M[AR], PC←PC+1; T2: decode.' },
    { id:'q48', topic:'instructions', q:'Memory-reference instructions kahan se execute hoti hain?', o:['T4 se','T0 se','T2 par hi','Sirf T3 par'], a:0, why:'T2 decode ke baad memory-reference T4 se execution shuru karte hain.' },
    { id:'q49', topic:'instructions', q:'LDA ka decoder output kya hai?', o:['D2','D1','D3','D7'], a:0, why:'LDA opcode 010 → D2; STA 011 → D3; ADD 001 → D1.' },
    { id:'q50', topic:'instructions', q:'STA ka micro-operation kya hai?', o:['M[AR] ← AC','AC ← DR','AC ← AC + DR','DR ← M[AR]'], a:0, why:'STA: D3 T4 → M[AR] ← AC, SC ← 0.' },
    { id:'q51', topic:'instructions', q:'ADD me carry kahan save hoti hai?', o:['E register mein','PC mein','AR mein','IR mein'], a:0, why:'D1 T5: AC ← AC + DR, E ← Cout.' },
    { id:'q52', topic:'instructions', q:'CIR (circulate right) ka hex code kya hai?', o:['7080','7040','1940','B940'], a:0, why:'CIR = 7080 (r B7); CIL = 7040 (r B6).' },
    { id:'q53', topic:'instructions', q:'CIL (7040), AC=8001, E=0 — result kya hai?', o:['AC=0002, E=1','AC=0001, E=1','AC=4000, E=0','AC=8002, E=0'], a:0, why:'shl → 0002; purana AC(15)=1 → E=1; purana E=0 → AC(0)=0.' },
    { id:'q54', topic:'instructions', q:'Instruction 1940 kya hai?', o:['ADD direct, address 940','STA indirect, address 940','LDA direct, address 940','CIR'], a:0, why:'1 = opcode 001 (ADD), I=0 → direct, address 940.' },
    { id:'q55', topic:'instructions', q:'Instruction B940 kya hai?', o:['STA indirect, address 940','ADD direct, 940','LDA indirect, 940','I/O instruction'], a:0, why:'B = 1011 → I=1, opcode 011 (STA), address 940.' },
    { id:'q56', topic:'instructions', q:'Register-reference instructions ka control function?', o:['r = D7 I’ T3','p = D7 I T3','D1 T5','D2 T4'], a:0, why:'7xxx → r = D7 I’ T3; Fxxx → p = D7 I T3.' },

    { id:'q57', topic:'arithmetic', q:'8-bit twos complement range kya hai?', o:['−128 se +127','−127 se +127','−128 se +128','0 se 255'], a:0, why:'Range = −2^(n−1) se 2^(n−1)−1 → −128 … +127.' },
    { id:'q58', topic:'arithmetic', q:'+18 ka 8-bit twos complement binary?', o:['00010010','11101110','00010001','10010010'], a:0, why:'Positive number seedha binary — 18 = 16+2 = 00010010.' },
    { id:'q59', topic:'arithmetic', q:'−18 ka 8-bit twos complement?', o:['11101110','00010010','11101101','10010010'], a:0, why:'00010010 → complement 11101101 → +1 = 11101110.' },
    { id:'q60', topic:'arithmetic', q:'Overflow ka rule kya hai?', o:['Same-sign operands ka result opposite sign ho jaye','Carry out hamesha overflow hai','Sirf negative numbers me',' sign bit 0 ho'], a:0, why:'Same signs add karo, result ka sign ulta → overflow. Carry out ignore hota hai.' },
    { id:'q61', topic:'arithmetic', q:'A − B kaise karte hain (twos complement me)?', o:['A + (−B)','A + B','A × B','B − A'], a:0, why:'Subtrahend ka twos complement lo aur add kar do.' },
    { id:'q62', topic:'arithmetic', q:'Booth algorithm me Q0 Q−1 = 10 par kya hota hai?', o:['A = A − M, phir shift','A = A + M, phir shift','Sirf shift','Kuch nahi'], a:0, why:'10 = 1s ki run ki shuruaat → subtract then shift.' },
    { id:'q63', topic:'arithmetic', q:'Booth algorithm me Q0 Q−1 = 01 par kya hota hai?', o:['A = A + M, phir shift','A = A − M, phir shift','Sirf shift','Carry set karo'], a:0, why:'01 = run ka end → add then shift.' },
    { id:'q64', topic:'arithmetic', q:'7 × 3 ka Booth result (A Q) kya aaya tha?', o:['0001 0101 = 21','0010 1010 = 42','0000 0111 = 7','1110 1001 = negative'], a:0, why:'4 cycles ke baad A=0001, Q=0101 → 00010101 = 21.' },
    { id:'q65', topic:'arithmetic', q:'Restoring division me A negative aa jaye to?', o:['Q0 = 0 aur M wapis add karke restore','Q0 = 1 aur continue','Turant overflow','Shift left karo'], a:0, why:'Negative matlab subtract fail — Q0=0 aur A restore.' },
    { id:'q66', topic:'arithmetic', q:'7 ÷ 3 ka quotient aur remainder?', o:['Q=2, R=1','Q=1, R=2','Q=3, R=0','Q=2, R=3'], a:0, why:'Restoring division example — Q=0010 (2), A=0001 (1).' },
    { id:'q67', topic:'arithmetic', q:'−7 ÷ 2 ke sign rules kaunsa sahi hai?', o:['Q=−3, R=−1','Q=3, R=1','Q=−3, R=1','Q=3, R=−1'], a:0, why:'sign(Q)=sign(D)×sign(V), sign(R)=sign(dividend) → −3, −1.' },
    { id:'q68', topic:'arithmetic', q:'Negative number ko sign extend karte waqt kya fill karte hain?', o:['1s','0s','Alternate bits','Sign bit hata dete hain'], a:0, why:'Negative ke sign bit 1 hoti hai — naye bits bhi 1s se fill.' },
    { id:'q69', topic:'arithmetic', q:'8-bit me −128 ki negation kya aati hai (galat result)?', o:['−128 hi','+128','0','−127'], a:0, why:'+128 8-bit range se bahar hai — isliye special case yaad rakhein.' }
  ],

  /* ---------------- Quick revision sheet ---------------- */
  revision: [
    { topic:'Interrupts', fact:'Instruction ke baad check → context save → ISR → restore' },
    { topic:'DMA', fact:'Processor sirf start aur end par; cycle stealing; no context save' },
    { topic:'Direct mapping', fact:'i = j mod m; Tag (s−r), Line (r), Word (w)' },
    { topic:'Set-associative', fact:'Set = j mod v; Tag (s−d), Set (d), Word (w)' },
    { topic:'Avg access time', fact:'t = h·C + (1−h)·M' },
    { topic:'Fetch', fact:'T0: AR←PC · T1: IR←M[AR], PC←PC+1 · T2: decode' },
    { topic:'LDA / STA / ADD', fact:'D2, D3, D1 (T4, T5)' },
    { topic:'CIR / CIL', fact:'7080 / 7040 — AC aur E 17-bit ring ki tarah' },
    { topic:'Register / I/O', fact:'r = D7 I’ T3 (7xxx) / p = D7 I T3 (Fxxx)' },
    { topic:'QPI units', fact:'Phit 20 bits · Flit 80 bits (72 payload + 8 CRC)' },
    { topic:'Twos complement', fact:'−2^(n−1) se 2^(n−1) − 1' },
    { topic:'Overflow', fact:'Same-sign operands, opposite-sign result' },
    { topic:'Booth', fact:'10 → A−M · 01 → A+M · 00/11 → shift' },
    { topic:'Division signs', fact:'sign(R)=sign(dividend); sign(Q)=sign(D)×sign(V)' }
  ],

  plan: [
    'Interrupts + DMA ke tables aur cycles yaad karo',
    'Cache: mapping formulas, numericals, write policy',
    'Instruction fetch timing + hex decode practice',
    'Registers, buses, QPI/PCIe tables revise karo',
    'Binary arithmetic: Booth aur division worked examples',
    '2 full mock tests do — 80%+ target'
  ]
};
