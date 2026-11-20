/* ============================================================
   COAL Coach — course content (teacher notes L1–L8)
   English translation, same flow as the guide:
   Definition → Working → Example → Exam Tip
   ============================================================ */
const COURSE_EN = {

  topics: [
    /* ------------------------------------------------ 1 */
    {
      id: 'interrupts', num: 1, icon: 'bolt', lecture: 'Lecture 2',
      title: 'Interrupts (ISR)',
      blurb: 'Immediate intimation of an event to the processor — context save, ISR, then resume from the same point.',
      sections: [
        {
          h: 'Definition',
          body: `<p>An interrupt is a <strong>signal</strong> sent to the processor by a device or event, so that the processor temporarily stops its current program and handles that event first.</p>
<p>The special program that handles the event is called the <strong>ISR (Interrupt Service Routine)</strong> or <strong>interrupt handler</strong>.</p>
<div class="callout"><strong>Real-life example:</strong> You are studying and the phone rings. You note the page number in your book (<em>context save</em>) and answer the call (<em>ISR</em>). After the call, you resume studying from the same page (<em>context restore</em>).</div>`
        },
        {
          h: 'Why are interrupts used?',
          body: `<p>Devices such as a printer or disk are much slower than the processor. If the processor waited for them all the time, it would sit idle. With interrupts, the processor keeps doing its own work, and when the device is ready, the device itself notifies the processor. This <strong>improves efficiency</strong>.</p>`
        },
        {
          h: 'Interrupt classes (Table 3.1)',
          body: `<div class="tbl-wrap"><table><thead><tr><th>Class</th><th>When it occurs</th></tr></thead><tbody>
<tr><td><strong>Program</strong></td><td>Error within the program — overflow, divide by zero</td></tr>
<tr><td><strong>Timer</strong></td><td>From the processor's internal timer, at regular intervals</td></tr>
<tr><td><strong>I/O</strong></td><td>From an I/O controller — operation complete or error</td></tr>
<tr><td><strong>Hardware failure</strong></td><td>Power failure, memory parity error</td></tr>
</tbody></table></div>`
        },
        {
          h: 'Interrupt cycle — the most important part for the exam',
          body: `<p>After each instruction executes, <strong>before</strong> the next fetch, the processor checks whether any interrupt is pending.</p>
<ol class="steps">
<li><strong>No interrupt:</strong> the next instruction is fetched.</li>
<li><strong>Interrupt pending:</strong> the current program is suspended.</li>
<li><strong>Context save:</strong> the PC and the rest of the processor state are saved on the stack.</li>
<li><strong>PC ← ISR address</strong> is loaded and the ISR runs.</li>
<li><strong>Context restore</strong> takes place and the program resumes from where it stopped.</li>
</ol>
<div class="callout warn"><strong>Remember:</strong> Context save is essential — otherwise the program cannot resume.</div>`
        },
        {
          h: 'Multiple Interrupts',
          body: `<p>If an ISR is running and another interrupt arrives, there are two approaches:</p>
<div class="tbl-wrap"><table><thead><tr><th></th><th>Disable interrupts</th><th>Priority-based nesting</th></tr></thead><tbody>
<tr><td><strong>Idea</strong></td><td>If one is being handled, new interrupts are ignored (remain pending)</td><td>A higher-priority interrupt can interrupt a lower-priority ISR</td></tr>
<tr><td><strong>Pros</strong></td><td>Simple, strictly sequential</td><td>Urgent device is served quickly</td></tr>
<tr><td><strong>Cons</strong></td><td>Does not consider priority</td><td>Complex, requires a stack</td></tr>
</tbody></table></div>
<p><strong>Example from the notes:</strong> Priorities — printer = 2, disk = 4, communications = 5.</p>
<ul class="clean">
<li><code>t = 10</code>: printer interrupt arrived → the user program's state went onto the stack, printer ISR started.</li>
<li><code>t = 15</code>: communications interrupt arrived (priority 5 &gt; 2) → printer ISR paused, its state pushed onto the stack, communications ISR ran.</li>
<li>The routines then resume in <strong>reverse order</strong>: first the printer ISR, then the user program.</li>
</ul>`
        },
        {
          h: 'Exam Tip',
          body: `<div class="callout tip"><strong>Exam Tip:</strong> "Explain interrupt cycle" and "compare two approaches of multiple interrupts" are very common questions. Be sure to memorize the table — especially the <em>context save → ISR → restore</em> sequence.</div>`
        }
      ],
      keypoints: [
        'Interrupt check: after instruction, before fetch',
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
              { t: 'Normal execution', body: `<p>The processor is executing an instruction of the user program. No interrupt is pending right now.</p><div class="flow"><span class="flow-node on">Fetch</span><span class="flow-arrow">→</span><span class="flow-node on">Decode</span><span class="flow-arrow">→</span><span class="flow-node on">Execute</span></div>` },
              { t: 'Interrupt check', body: `<p>After the instruction executes, the processor checks the interrupt line <strong>before the next fetch</strong>.</p><div class="flow"><span class="flow-node on">Execute</span><span class="flow-arrow">→</span><span class="flow-node on">Check interrupt?</span><span class="flow-arrow">→</span><span class="flow-node">Fetch next</span></div>` },
              { t: 'Interrupt detected', body: `<p>The I/O controller sent a signal — the device is ready. The current program is now temporarily suspended.</p><div class="callout warn"><strong>Interrupt pending!</strong> The next instruction will not be fetched.</div>` },
              { t: 'Context save', body: `<p>The PC (address of the next instruction) and the rest of the processor state (flags, registers) are <strong>pushed onto the stack</strong>. This is the most important step.</p><div class="flow"><span class="flow-node on">PC</span><span class="flow-arrow">→</span><span class="flow-node on">Stack</span><span class="flow-arrow">+</span><span class="flow-node on">Processor state</span></div>` },
              { t: 'ISR run', body: `<p>The <strong>ISR's starting address</strong> is loaded into the PC and the processor runs the interrupt handler — that is, it services the device.</p><div class="flow"><span class="flow-node on">PC ← ISR address</span><span class="flow-arrow">→</span><span class="flow-node on">ISR execute</span></div>` },
              { t: 'Context restore & resume', body: `<p>When the ISR ends, the old PC and state are loaded back from the stack. The program <strong>resumes from the same point</strong> where it stopped — just like resuming your studies after a phone call.</p><div class="flow"><span class="flow-node on">Restore PC</span><span class="flow-arrow">→</span><span class="flow-node on">Resume program</span></div>` }
            ]
          },
          {
            name: 'Priority nesting example',
            steps: [
              { t: 't = 10 — printer interrupt', body: `<p>The printer sent an interrupt (priority 2). The user program's state is saved on the stack and the printer ISR starts.</p><div class="flow"><span class="flow-node">User program</span><span class="flow-arrow">→</span><span class="flow-node on">Printer ISR (2)</span></div>` },
              { t: 't = 15 — communications arrived', body: `<p>A communications interrupt arrived with priority <strong>5</strong> — higher than the printer (2). In a priority scheme, a higher priority can preempt a lower ISR.</p><div class="callout tip"><strong>Disable approach</strong>: this interrupt would simply remain pending and would not be served quickly.</div>` },
              { t: 'Printer ISR is also saved', body: `<p>The printer ISR's own state is also pushed onto the stack (a stack is required for nesting). Now the communications ISR is running.</p><div class="flow"><span class="flow-node">User state</span><span class="flow-arrow">·</span><span class="flow-node">Printer state</span><span class="flow-arrow">→</span><span class="flow-node on">Comm ISR (5)</span></div>` },
              { t: 'Resume in reverse order', body: `<p>Communications ISR ends → printer ISR resumes → then the user program. The stack works like LIFO.</p><div class="flow"><span class="flow-node on">Comm done</span><span class="flow-arrow">→</span><span class="flow-node on">Printer ISR</span><span class="flow-arrow">→</span><span class="flow-node on">User program</span></div>` }
            ]
          }
        ]
      }
    },

    /* ------------------------------------------------ 2 */
    {
      id: 'dma', num: 2, icon: 'swap', lecture: 'Lecture 3',
      title: 'Direct Memory Access (DMA)',
      blurb: 'The I/O module reads/writes directly to memory — the processor is involved only at the start and end.',
      sections: [
        {
          h: 'Definition',
          body: `<p>DMA is a technique in which the processor gives the I/O module the authority to read or write <strong>directly to main memory</strong>, without the processor getting in the way. This is done by the <strong>DMA controller</strong>.</p>`
        },
        {
          h: 'Why is DMA needed?',
          body: `<div class="tbl-wrap"><table><thead><tr><th>Method</th><th>Who moves the data</th><th>Problem</th></tr></thead><tbody>
<tr><td><strong>Programmed I/O</strong></td><td>The processor, word by word</td><td>The processor keeps waiting and does no useful work</td></tr>
<tr><td><strong>Interrupt-driven I/O</strong></td><td>The processor, when the device is ready</td><td>Every word passes through the processor, with an interrupt for each word</td></tr>
<tr><td><strong>DMA</strong></td><td>DMA controller, device ↔ memory</td><td>Processor involved only at start and end — best solution</td></tr>
</tbody></table></div>
<div class="callout"><strong>Conclusion:</strong> DMA is best for large block transfers (disk, network).</div>`
        },
        {
          h: 'DMA Controller Registers',
          body: `<ul class="clean">
<li><strong>Address register</strong> — where in memory the transfer starts.</li>
<li><strong>Word count register</strong> — how many words to transfer.</li>
<li><strong>Data register</strong> — temporary holding of data in transit.</li>
<li><strong>Control/Status register</strong> — read/write direction, start, done.</li>
</ul>`
        },
        {
          h: 'How DMA works (step by step)',
          body: `<ol class="steps">
<li>The processor tells the DMA controller: the operation (read/write), device address, starting memory address and word count. The processor then moves on to other work.</li>
<li>The DMA controller makes a <strong>bus request</strong>.</li>
<li>The processor issues a <strong>bus grant</strong> at the end of the current bus cycle and releases the address, data and control lines.</li>
<li>Data is transferred directly between the device and memory. The controller places the address on the address bus, issues the read/write command, <strong>increments</strong> the address register and <strong>decrements</strong> the word count.</li>
<li>This repeats until <code>word count = 0</code>.</li>
<li>The controller releases the bus and sends the processor an <strong>interrupt</strong> to say the transfer is complete.</li>
<li>The processor checks the status and moves on with the data.</li>
</ol>
<div class="callout tip"><strong>Exam line:</strong> The processor is involved only in steps 1 and 7 — the controller does everything else.</div>`
        },
        {
          h: 'Cycle Stealing and Burst Mode',
          body: `<p>The processor and the DMA controller share the same bus, so only one can use it at a time.</p>
<ul class="clean">
<li><strong>Cycle stealing:</strong> the controller takes one cycle at a time between the processor's bus cycles. The processor simply pauses briefly before its next bus access — it does <em>not save context</em>.</li>
<li><strong>Burst mode:</strong> the controller holds the bus until the entire block transfer is complete.</li>
</ul>`
        },
        {
          h: 'DMA vs Interrupt',
          body: `<div class="tbl-wrap"><table><thead><tr><th></th><th>Interrupt</th><th>DMA</th></tr></thead><tbody>
<tr><td><strong>Processor involvement</strong></td><td>Runs an ISR</td><td>Only at start and end</td></tr>
<tr><td><strong>Context saved?</strong></td><td>Yes (PC and state)</td><td>No</td></tr>
<tr><td><strong>Granularity</strong></td><td>Between instructions</td><td>Between bus cycles</td></tr>
<tr><td><strong>Best for</strong></td><td>Small, occasional transfers</td><td>Large block transfers</td></tr>
</tbody></table></div>`
        },
        {
          h: 'Model Exam Answer',
          body: `<div class="callout purple"><strong>Answer:</strong> DMA is a technique where an I/O module reads or writes main memory directly without going through the processor. The processor starts the transfer by giving the DMA controller the device, memory address and word count. The controller takes control of the bus, transfers the data (usually by cycle stealing) and interrupts the processor when done. This frees the processor and greatly improves efficiency for large block transfers.</div>`
        }
      ],
      keypoints: [
        'Processor: only start + end',
        'Cycle stealing = between bus cycles, no context save',
        'Burst = hold the bus for the whole block',
        'Word count = 0 → done interrupt'
      ],
      visual: {
        title: 'DMA transfer — bus ownership',
        scenarios: [
          {
            name: '7-step transfer',
            steps: [
              { t: 'Step 1 — Processor setup', body: `<p>The processor gives the controller: <strong>read/write, device address, memory address, word count</strong>. It then moves on to its own work.</p><div class="flow"><span class="flow-node on">CPU</span><span class="flow-arrow">→</span><span class="flow-node on">DMA controller</span></div>` },
              { t: 'Step 2 — Bus request', body: `<p>The controller needs the bus — it sends a <strong>bus request</strong> signal.</p><div class="flow"><span class="flow-node on">DMA</span><span class="flow-arrow">→ BR →</span><span class="flow-node on">CPU</span></div>` },
              { t: 'Step 3 — Bus grant', body: `<p>The CPU grants the bus at the <strong>end</strong> of the current bus cycle and releases the address/data/control lines.</p><div class="callout tip"><strong>The bus now belongs to the controller:</strong> the CPU keeps doing its internal work.</div>` },
              { t: 'Step 4 — Direct transfer', body: `<p>Device ↔ memory directly. For each word, the address register is <strong>incremented</strong> and the word count is <strong>decremented</strong>.</p><div class="flow"><span class="flow-node on">I/O device</span><span class="flow-arrow">↔</span><span class="flow-node on">Memory</span></div>` },
              { t: 'Step 5 — Repeat', body: `<p>Repeat until <code>word count = 0</code>. The controller runs this whole loop — the CPU is free.</p>` },
              { t: 'Step 6 — Done interrupt', body: `<p>The controller releases the bus and sends the CPU an <strong>interrupt</strong>: transfer complete.</p><div class="flow"><span class="flow-node on">DMA</span><span class="flow-arrow">→ IRQ →</span><span class="flow-node on">CPU</span></div>` },
              { t: 'Step 7 — CPU finish', body: `<p>The CPU checks the status and moves on with the data. <strong>The CPU was involved only here and in step 1.</strong></p>` }
            ]
          },
          {
            name: 'Cycle stealing vs Burst',
            steps: [
              { t: 'Shared bus problem', body: `<p>The CPU and DMA share the same bus. Only one can work at a time — so bus arbitration is necessary.</p>` },
              { t: 'Cycle stealing', body: `<p>The controller takes one cycle at a time <strong>between</strong> the CPU's bus cycles. The CPU pauses briefly, but there is <strong>no context save</strong>.</p><div class="flow"><span class="flow-node on">CPU</span><span class="flow-arrow">|</span><span class="flow-node on">DMA</span><span class="flow-arrow">|</span><span class="flow-node on">CPU</span><span class="flow-arrow">|</span><span class="flow-node on">DMA</span></div>` },
              { t: 'Burst mode', body: `<p>The controller holds the bus until the whole block transfer is done. It is fast, but the CPU cannot use the bus for a long time.</p><div class="flow"><span class="flow-node">CPU</span><span class="flow-arrow">|</span><span class="flow-node on" style="min-width:180px">DMA — full block — DMA — DMA</span><span class="flow-arrow">|</span><span class="flow-node">CPU</span></div>` },
              { t: 'Exam comparison', body: `<p><strong>Cycle stealing:</strong> short pauses, CPU slow but active. <strong>Burst:</strong> one long pause, fastest block transfer. Neither saves context — that is the difference from an interrupt.</p>` }
            ]
          }
        ]
      }
    },

    /* ------------------------------------------------ 3 */
    {
      id: 'cache', num: 3, icon: 'layers', lecture: 'Lectures 5, 6, 7',
      title: 'Cache Memory (Physical, Virtual, Victim)',
      blurb: 'Fast memory between the CPU and RAM — hit/miss, mapping, replacement and performance numbers.',
      sections: [
        {
          h: 'Definition and Concept',
          body: `<p>Cache is a small, very fast memory located between the processor and the slow main memory. It holds <strong>copies</strong> of portions of main memory.</p>
<ul class="clean">
<li><strong>Hit:</strong> the word the processor wants is found in the cache — the system bus is not used.</li>
<li><strong>Miss:</strong> the word is not found in the cache — the entire <strong>block</strong> is loaded from main memory into the cache.</li>
</ul>
<div class="callout"><strong>Example:</strong> You take a book from the library (main memory) and put it on your study table (cache). If it is on the table → you find it immediately (hit). If not → you have to go to the library (miss).</div>`
        },
        {
          h: 'Physical vs Virtual (Logical) Cache',
          body: `<p>In virtual memory, programs use <strong>logical (virtual) addresses</strong> and the <strong>MMU</strong> translates them into physical addresses.</p>
<div class="tbl-wrap"><table><thead><tr><th></th><th>Logical (Virtual) Cache</th><th>Physical Cache</th></tr></thead><tbody>
<tr><td><strong>What it stores</strong></td><td>Virtual addresses</td><td>Physical addresses</td></tr>
<tr><td><strong>Position</strong></td><td><strong>Before</strong> the MMU</td><td><strong>After</strong> the MMU</td></tr>
<tr><td><strong>Speed</strong></td><td>Faster — no wait for translation</td><td>Access after translation</td></tr>
</tbody></table></div>`
        },
        {
          h: 'Mapping Functions',
          body: `<p>There are fewer cache lines than main memory blocks, so a mapping is needed.</p>
<div class="tbl-wrap"><table><thead><tr><th></th><th>Direct</th><th>Associative</th><th>Set Associative</th></tr></thead><tbody>
<tr><td><strong>Idea</strong></td><td>Each block goes in only one specific line</td><td>Block can go in any line</td><td>Block can go in any line of one set</td></tr>
<tr><td><strong>Formula</strong></td><td><code>i = j mod m</code></td><td>none</td><td><code>set = j mod v</code></td></tr>
<tr><td><strong>Address fields</strong></td><td>Tag (s−r), Line (r), Word (w)</td><td>Tag (s), Word (w)</td><td>Tag (s−d), Set (d), Word (w)</td></tr>
<tr><td><strong>Drawback</strong></td><td>Conflict misses</td><td>Compare the tag of every line — costly</td><td>A compromise between the two</td></tr>
</tbody></table></div>
<div class="callout tip"><strong>Summary:</strong> Direct is simple but has conflict misses; associative is flexible but the hardware is expensive; set associative balances the two.</div>`
        },
        {
          h: 'Numerical Example (appears in the exam)',
          body: `<p><strong>Given:</strong> 24-bit address, 4-byte blocks, 16K lines.</p>
<ul class="clean">
<li><strong>Direct:</strong> Word = 2 bits (4 = 2²), Line = 14 bits (16K = 2¹⁴), <strong>Tag = 24 − 14 − 2 = 8 bits</strong>.</li>
<li><strong>Associative:</strong> Tag = 24 − 2 = <strong>22 bits</strong>, Word = 2 bits.</li>
<li><strong>2-way set associative:</strong> Sets = 16K / 2 = 8K = 2¹³ → Set = 13 bits, Word = 2 bits, <strong>Tag = 24 − 13 − 2 = 9 bits</strong>.</li>
</ul>
<div class="callout tip"><strong>Try it yourself:</strong> Change these numbers in the topic's <em>Lab</em> tab and check the answer.</div>`
        },
        {
          h: 'Replacement Algorithms',
          body: `<p>Direct mapping offers no choice. The others need a replacement algorithm — implemented in hardware.</p>
<ul class="clean">
<li><strong>LRU (Least Recently Used):</strong> the block that has gone unused the longest — the most popular and effective.</li>
<li><strong>FIFO:</strong> replace the oldest block.</li>
<li><strong>LFU (Least Frequently Used):</strong> the block referenced the least — uses a counter on each line.</li>
</ul>`
        },
        {
          h: 'Write Policy',
          body: `<ul class="clean">
<li><strong>Write through:</strong> every write goes to <em>both</em> the cache and main memory. Simple, but more memory traffic and it can become a bottleneck.</li>
<li><strong>Write back:</strong> only the cache is updated; the block is written to memory only when it is replaced. Fewer memory writes, but the circuitry is complex and I/O has to go through the cache.</li>
</ul>`
        },
        {
          h: 'Victim Cache',
          body: `<p>Used to reduce conflict misses in a <strong>direct-mapped L1</strong>. It is <strong>fully associative</strong>, holds <strong>4 to 16 lines</strong>, and sits between L1 and the next level.</p>
<p>Blocks evicted from L1 (victims) are kept here, so they can be found quickly if needed again.</p>`
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
        'Hit → no bus; Miss → load the whole block',
        'Direct i = j mod m; Set = j mod v',
        'Tag = address bits − index bits − word bits',
        'LRU best replacement; Write back fewer memory writes',
        't = h·C + (1−h)·M'
      ],
      visual: {
        title: 'Cache hit / miss flow',
        scenarios: [
          {
            name: 'Hit vs Miss',
            steps: [
              { t: 'CPU requests a word', body: `<p>The processor requests a word at an address. The cache checks its tags.</p><div class="flow"><span class="flow-node on">CPU</span><span class="flow-arrow">→</span><span class="flow-node on">Cache tags</span></div>` },
              { t: 'HIT', body: `<p>The word <strong>was found in the cache</strong>. Data reaches the CPU immediately — <strong>the system bus is not used</strong>.</p><div class="flow"><span class="flow-node on">Cache</span><span class="flow-arrow">→</span><span class="flow-node on">CPU ✓ fast</span></div><div class="callout tip">The higher the <strong>hit ratio h</strong>, the lower the average access time.</div>` },
              { t: 'MISS', body: `<p>The word was not found. Now the entire <strong>block</strong> is loaded from main memory into the cache — not just one word.</p><div class="flow"><span class="flow-node on">Main memory</span><span class="flow-arrow">→ block →</span><span class="flow-node on">Cache</span><span class="flow-arrow">→</span><span class="flow-node on">CPU</span></div>` },
              { t: 'Replacement', body: `<p>If the target line is occupied, a replacement algorithm runs: <strong>LRU</strong> (unused for the longest time), FIFO or LFU. Direct mapping offers no choice — the block goes straight to that line, <code>i = j mod m</code>.</p>` },
              { t: 'Victim cache (direct L1)', body: `<p>A block evicted from L1 (victim) is kept in a small <strong>fully associative</strong> cache (4–16 lines). On a conflict miss, it is found quickly there.</p><div class="flow"><span class="flow-node on">L1 evict</span><span class="flow-arrow">→</span><span class="flow-node on">Victim cache</span><span class="flow-arrow">→</span><span class="flow-node on">L2</span></div>` }
            ]
          },
          {
            name: 'Virtual vs Physical',
            steps: [
              { t: 'Program uses a virtual address', body: `<p>The program does not know where the data is in physical memory — it supplies a <strong>virtual address</strong>.</p><div class="flow"><span class="flow-node on">Program</span><span class="flow-arrow">→ VA</span><span class="flow-node on">?</span></div>` },
              { t: 'Logical (virtual) cache', body: `<p>The cache is <strong>before the MMU</strong> — it looks up using virtual addresses. No wait for translation, so it is <strong>faster</strong>.</p><div class="flow"><span class="flow-node on">VA</span><span class="flow-arrow">→</span><span class="flow-node on">Virtual cache</span><span class="flow-arrow">→</span><span class="flow-node on">MMU</span></div>` },
              { t: 'Physical cache', body: `<p>The cache is <strong>after the MMU</strong> — first VA → PA translation, then cache access. Slightly slower but a simple design.</p><div class="flow"><span class="flow-node on">VA</span><span class="flow-arrow">→</span><span class="flow-node on">MMU</span><span class="flow-arrow">→ PA →</span><span class="flow-node on">Physical cache</span></div>` }
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
      blurb: "The basic computer's 8 registers, the common bus, and register transfer using S2S1S0.",
      sections: [
        {
          h: 'Registers of the Basic Computer',
          body: `<div class="tbl-wrap"><table><thead><tr><th>Register</th><th>Size</th><th>Function</th></tr></thead><tbody>
<tr><td><strong>DR</strong> — Data Register</td><td>16 bits</td><td>Holds an operand fetched from memory</td></tr>
<tr><td><strong>AR</strong> — Address Register</td><td>12 bits</td><td>Holds a memory address</td></tr>
<tr><td><strong>AC</strong> — Accumulator</td><td>16 bits</td><td>Main processor register, results go here</td></tr>
<tr><td><strong>IR</strong> — Instruction Register</td><td>16 bits</td><td>Holds the current instruction</td></tr>
<tr><td><strong>PC</strong> — Program Counter</td><td>12 bits</td><td>Address of the next instruction</td></tr>
<tr><td><strong>TR</strong> — Temporary Register</td><td>16 bits</td><td>Temporary data</td></tr>
<tr><td><strong>INPR</strong></td><td>8 bits</td><td>Input register</td></tr>
<tr><td><strong>OUTR</strong></td><td>8 bits</td><td>Output register</td></tr>
</tbody></table></div>
<p>There is also a 1-bit register <strong>E (carry/extend)</strong>.</p>`
        },
        {
          h: 'Common Bus System',
          body: `<ul class="clean">
<li>All seven registers and memory are connected to a <strong>common bus</strong>.</li>
<li>Selection lines <code>S2 S1 S0</code> decide which register puts data on the bus.</li>
<li>When <strong>AR/PC</strong> go onto the 16-bit bus, the upper 4 bits are <code>0</code>; when receiving, they take only the lower 12 bits.</li>
<li><strong>INPR</strong> can put data on the bus, but <strong>OUTR</strong> can only receive (<code>INPR → AC</code>, <code>AC → OUTR</code>).</li>
<li>The address input of memory is always connected to <strong>AR</strong>.</li>
<li>The inputs of AC come from the adder/logic circuit — one set from AC itself (complement, shift), the other from DR (add, AND).</li>
</ul>`
        },
        {
          h: 'Register Transfer (core idea)',
          body: `<p>A register-to-register move means: select the <strong>source register</strong> with <code>S2 S1 S0</code> (it goes onto the bus), and for the <strong>destination</strong>, enable the <code>LD (load)</code> input.</p>
<div class="callout tip"><strong>Example — AR ← PC (at T0):</strong> set <code>S2 S1 S0 = 010</code> to put PC on the bus and enable AR's LD. The value of PC is copied into AR.</div>`
        },
        {
          h: 'Register Movement Summary',
          body: `<div class="tbl-wrap"><table><thead><tr><th>Register</th><th>Role in instructions</th></tr></thead><tbody>
<tr><td><strong>PC</strong></td><td>Into AR at T0, incremented at T1</td></tr>
<tr><td><strong>AR</strong></td><td>Holds the address for every memory read/write</td></tr>
<tr><td><strong>IR</strong></td><td>Receives the instruction at T1; its parts feed the decoder, AR and I</td></tr>
<tr><td><strong>DR</strong></td><td>Memory operand, then to AC (LDA) or the adder (ADD)</td></tr>
<tr><td><strong>AC</strong></td><td>LDA: DR; ADD: AC+DR; shift: shifted value; STA: store</td></tr>
<tr><td><strong>E</strong></td><td>Carry out of ADD; rotates with AC in CIR/CIL</td></tr>
</tbody></table></div>`
        }
      ],
      keypoints: [
        'AR/PC = 12 bits; AC/DR/IR/TR = 16 bits',
        'S2 S1 S0 = 010 → PC on bus',
        'INPR → AC → OUTR (OUTR only receives)',
        'Memory address input always from AR'
      ],
      visual: {
        title: 'Common bus — register transfer',
        scenarios: [
          {
            name: 'Transfer via the bus',
            steps: [
              { t: 'Common bus', body: `<p>Seven registers and memory connect to a single bus. At any time, only <strong>one source</strong> puts data on the bus.</p><div class="flow"><span class="flow-node on">DR</span><span class="flow-node on">AR</span><span class="flow-node on">AC</span><span class="flow-node on">IR</span><span class="flow-node on">PC</span><span class="flow-node on">TR</span><span class="flow-node on">INPR</span></div>` },
              { t: 'Selection lines S2 S1 S0', body: `<p>Three selection lines give 8 combinations — to select one register (or memory).</p>` },
              { t: 'Example: AR ← PC', body: `<p><code>S2 S1 S0 = 010</code> → PC goes onto the bus. AR's <code>LD = 1</code> → the value is copied into AR. This happens at T0.</p><div class="flow"><span class="flow-node on">PC (010)</span><span class="flow-arrow">→ bus →</span><span class="flow-node on">AR (LD=1)</span></div>` },
              { t: 'Destination load', body: `<p>Selection alone is not enough — the destination's <strong>LD (load) input</strong> must also be enabled. Only then is the data written into the register.</p>` },
              { t: 'Special cases', body: `<p><strong>AR/PC</strong> take only 12 bits when receiving. <strong>INPR</strong> can put data on the bus, but <strong>OUTR</strong> only receives — <code>INPR → AC → OUTR</code>.</p>` }
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
      blurb: 'Data, Address and Control buses — QPI layers, phit/flit and PCI/PCIe.',
      sections: [
        {
          h: 'Definition',
          body: `<p>A bus is a <strong>shared communication pathway</strong> that connects the components of a computer (CPU, memory, I/O).</p>`
        },
        {
          h: 'Three Types of Bus',
          body: `<div class="tbl-wrap"><table><thead><tr><th>Bus</th><th>Function</th></tr></thead><tbody>
<tr><td><strong>Data bus</strong></td><td>Carries data. The number of lines is its <strong>width</strong> (32, 64, 128...) — a key factor in performance.</td></tr>
<tr><td><strong>Address bus</strong></td><td>Identifies the source or destination. Its width determines the <strong>maximum memory capacity</strong>.</td></tr>
<tr><td><strong>Control bus</strong></td><td>Controls access to the shared lines. <em>Timing signals</em> indicate when data is valid; <em>command signals</em> specify the operation.</td></tr>
</tbody></table></div>
<div class="callout"><strong>Example:</strong> A 12-bit address bus can address <code>2¹² = 4096</code> locations (4K words).</div>
<p>In the address bus, the <strong>high-order bits</strong> select the module and the <strong>low-order bits</strong> select the location within that module. To send data on the bus, a module must first obtain the bus (<strong>arbitration</strong>), then the transfer takes place.</p>`
        },
        {
          h: 'Point-to-Point Interconnect — QPI (2008)',
          body: `<p>In place of a shared bus, modern general-purpose computers use <strong>point-to-point links</strong>.</p>
<ul class="clean">
<li>Direct pairwise connections — <strong>no arbitration needed</strong>.</li>
<li><strong>Packetized transfer</strong> — with control headers and error codes.</li>
</ul>
<div class="tbl-wrap"><table><thead><tr><th>QPI Layer</th><th>Function</th></tr></thead><tbody>
<tr><td><strong>Physical</strong></td><td>Wires and signaling. Unit: <strong>phit = 20 bits</strong></td></tr>
<tr><td><strong>Link</strong></td><td>Flow control and error control. Unit: <strong>flit = 80 bits</strong> (72 payload + 8 CRC)</td></tr>
<tr><td><strong>Routing</strong></td><td>Decides the path of a packet</td></tr>
<tr><td><strong>Protocol</strong></td><td>Packet unit of transfer; the cache coherency protocol runs here</td></tr>
</tbody></table></div>`
        },
        {
          h: 'PCI and PCIe',
          body: `<ul class="clean">
<li><strong>PCI:</strong> high-bandwidth, processor-independent bus.</li>
<li><strong>PCIe:</strong> a point-to-point scheme designed to replace bus-based PCI.</li>
<li>The <strong>root complex</strong> connects the processor and memory to the PCIe switch fabric.</li>
<li>A PCIe <strong>lane is bidirectional</strong> (a QPI lane is one-directional). Ports have <strong>1, 4, 6, 16 or 32 lanes</strong>.</li>
<li>Three layers: <strong>physical, data link, transaction</strong>.</li>
<li>The transaction layer creates <strong>TLPs</strong>. Most are <strong>split transactions</strong> (request → completion). <strong>Posted</strong> transactions have no reply.</li>
</ul>`
        },
        {
          h: 'Exam Tip',
          body: `<div class="callout tip"><strong>Exam Tip:</strong> Be sure to memorize the table of the three buses, the 4 layers of QPI, and the difference between <strong>phit (20 bits) and flit (80 bits)</strong>. A PCIe lane is bidirectional — a QPI lane is directional.</div>`
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
        title: 'Bus transfer and layers',
        scenarios: [
          {
            name: 'Shared bus transaction',
            steps: [
              { t: 'A device wants the bus', body: `<p>CPU, memory or I/O module — all connect to the same shared bus. Only one driver at a time.</p>` },
              { t: 'Arbitration', body: `<p>A module first obtains the bus (arbitration). Only then can it drive the address/data/control lines.</p><div class="flow"><span class="flow-node on">Request</span><span class="flow-arrow">→</span><span class="flow-node on">Grant</span><span class="flow-arrow">→</span><span class="flow-node on">Drive bus</span></div>` },
              { t: 'Address + Control', body: `<p>The <strong>address bus</strong> indicates the source/destination — high-order bits select the module, low-order bits the location within it. The <strong>control bus</strong> issues the read/write command.</p>` },
              { t: 'Data + timing', body: `<p>Data travels on the <strong>data bus</strong>. Timing signals on the control bus indicate when the data is valid.</p>` },
              { t: 'Meaning of width', body: `<p>A 12-bit address bus → <code>2¹² = 4096</code> locations. A 64-bit data bus → 8 bytes per cycle. Increasing width improves both performance and capacity.</p>` }
            ]
          },
          {
            name: 'The 4 layers of QPI',
            steps: [
              { t: 'Physical layer', body: `<p>Wires and signaling. Small unit: <strong>phit = 20 bits</strong>.</p><div class="flow"><span class="flow-node on">Phit · 20 bits</span></div>` },
              { t: 'Link layer', body: `<p>Flow control + error control. <strong>Flit = 80 bits</strong> = 72-bit payload + 8-bit CRC.</p><div class="flow"><span class="flow-node on">72 payload</span><span class="flow-arrow">+</span><span class="flow-node on">8 CRC</span><span class="flow-arrow">=</span><span class="flow-node on">80-bit flit</span></div>` },
              { t: 'Routing layer', body: `<p>Decides the <strong>path</strong> of a packet — which point-to-point link to take next.</p>` },
              { t: 'Protocol layer', body: `<p>The unit of packet transfer is defined here. The <strong>cache coherency protocol</strong> runs here.</p>` },
              { t: 'Compare with PCIe', body: `<p>PCIe is point-to-point, has <strong>3 layers</strong> (physical, data link, transaction), and <strong>bidirectional</strong> lanes. A QPI lane is one-directional — that is why PCIe replaced PCI.</p>` }
            ]
          }
        ]
      },
      lab: 'bus'
    },

    /* ------------------------------------------------ 6 */
    {
      id: 'instructions', num: 6, icon: 'code', lecture: 'Lecture 8',
      title: 'Instructions and Their Working',
      blurb: '16-bit format, fetch–decode, micro-operations of MOV/ADD/Shift, and hex decoding.',
      sections: [
        {
          h: 'Structure of an Instruction',
          body: `<p>An instruction is a <strong>binary code</strong> that specifies a sequence of microoperations. It consists of an <strong>opcode</strong> (what to do) and an operand/address part.</p>
<p>In the basic computer, a 16-bit instruction:</p>
<ul class="clean">
<li><code>IR(15) = I</code> → mode bit</li>
<li><code>IR(12–14) = 3-bit opcode</code></li>
<li><code>IR(0–11) = 12-bit address</code></li>
</ul>
<p><strong>Direct addressing (I = 0):</strong> the address field holds the address of the data. <strong>Indirect (I = 1):</strong> the address field holds the location that contains the actual address of the data.</p>`
        },
        {
          h: 'Instruction Formats',
          body: `<div class="tbl-wrap"><table><thead><tr><th>Type</th><th>Identification</th><th>Remaining bits</th></tr></thead><tbody>
<tr><td><strong>Memory-reference</strong></td><td>Opcode 000 to 110</td><td>1-bit I + 12-bit address</td></tr>
<tr><td><strong>Register-reference</strong></td><td>Opcode 111, I = 0 (hex <code>7xxx</code>)</td><td>Operation/test on AC</td></tr>
<tr><td><strong>Input-output</strong></td><td>Opcode 111, I = 1 (hex <code>Fxxx</code>)</td><td>I/O operation/test</td></tr>
</tbody></table></div>`
        },
        {
          h: 'Fetch and Decode (common to every instruction)',
          body: `<p>Timing signals <code>T0, T1, T2...</code> come from the sequence counter (SC).</p>
<div class="tbl-wrap"><table><thead><tr><th>Timing</th><th>Micro-operation</th><th>Meaning</th></tr></thead><tbody>
<tr><td><strong>T0</strong></td><td><code>AR ← PC</code></td><td>Address of the instruction into AR</td></tr>
<tr><td><strong>T1</strong></td><td><code>IR ← M[AR], PC ← PC+1</code></td><td>Instruction into IR, PC incremented</td></tr>
<tr><td><strong>T2</strong></td><td><code>Decode IR(12-14), AR ← IR(0-11), I ← IR(15)</code></td><td>Decode, address into AR, mode bit saved</td></tr>
</tbody></table></div>
<p>The opcode goes into a <strong>3-to-8 decoder</strong> that produces outputs <code>D0</code> through <code>D7</code>.</p>
<div class="tbl-wrap"><table><thead><tr><th>Condition</th><th>Type</th><th>Action</th></tr></thead><tbody>
<tr><td><code>D7 = 0, I = 1</code></td><td>Memory-reference, indirect</td><td>T3: <code>AR ← M[AR]</code> (actual address)</td></tr>
<tr><td><code>D7 = 0, I = 0</code></td><td>Memory-reference, direct</td><td>T3: nothing</td></tr>
<tr><td><code>D7 = 1, I = 0</code></td><td>Register-reference</td><td>Executes at T3, <code>r = D7 I' T3</code></td></tr>
<tr><td><code>D7 = 1, I = 1</code></td><td>Input-output</td><td>Executes at T3, <code>p = D7 I T3</code></td></tr>
</tbody></table></div>
<p><strong>Memory-reference instructions execute starting at T4.</strong></p>`
        },
        {
          h: 'MOV (Data Movement): LDA and STA',
          body: `<p>The basic computer has no single MOV instruction — data movement is done by <strong>LDA</strong> and <strong>STA</strong>.</p>
<p><strong>LDA</strong> (memory → AC), opcode 010, decoder <code>D2</code>:</p>
<div class="tbl-wrap"><table><thead><tr><th>Timing</th><th>Micro-operation</th></tr></thead><tbody>
<tr><td><code>D2 T4</code></td><td><code>DR ← M[AR]</code></td></tr>
<tr><td><code>D2 T5</code></td><td><code>AC ← DR, SC ← 0</code></td></tr>
</tbody></table></div>
<p><strong>STA</strong> (AC → memory), opcode 011, decoder <code>D3</code>:</p>
<div class="tbl-wrap"><table><thead><tr><th>Timing</th><th>Micro-operation</th></tr></thead><tbody>
<tr><td><code>D3 T4</code></td><td><code>M[AR] ← AC, SC ← 0</code></td></tr>
</tbody></table></div>
<div class="callout"><strong>Why is DR needed?</strong> The value from memory must first come into a register before it can enter AC's adder/logic circuit.</div>
<p><strong>Example:</strong> Instruction <code>2940</code> (LDA direct, address 940). If <code>M[940] = 0007</code>: at T4, <code>DR ← 0007</code>; at T5, <code>AC ← 0007</code>.</p>`
        },
        {
          h: 'ADD',
          body: `<p>Opcode 001, decoder <code>D1</code>. Hex: <code>1xxx</code> (direct) or <code>9xxx</code> (indirect).</p>
<div class="tbl-wrap"><table><thead><tr><th>Timing</th><th>Micro-operation</th><th>Explanation</th></tr></thead><tbody>
<tr><td>T0–T2</td><td>Fetch and decode</td><td><code>D1 = 1</code> becomes true</td></tr>
<tr><td>T3</td><td><code>AR ← M[AR]</code></td><td>Only when I = 1 — indirect address</td></tr>
<tr><td><code>D1 T4</code></td><td><code>DR ← M[AR]</code></td><td>Operand into DR</td></tr>
<tr><td><code>D1 T5</code></td><td><code>AC ← AC + DR, E ← Cout, SC ← 0</code></td><td>Add; carry into E</td></tr>
</tbody></table></div>
<p><strong>Worked example:</strong> <code>1940</code> (ADD direct, 940), <code>AC = 0005</code>, <code>M[940] = 0003</code>.</p>
<ul class="clean"><li>T4: <code>DR ← 0003</code></li><li>T5: <code>AC ← 0005 + 0003 = 0008, E = 0</code></li></ul>`
        },
        {
          h: 'SHIFT: CIR and CIL',
          body: `<p>Register-reference instructions (opcode 111, I = 0) — <code>r = D7 I' T3</code>, identified by bits <code>B0–B11</code>.</p>
<div class="tbl-wrap"><table><thead><tr><th>Instruction</th><th>Hex</th><th>Control</th><th>Micro-operation (at T3)</th></tr></thead><tbody>
<tr><td><strong>CIR</strong> (circulate right)</td><td><code>7080</code></td><td><code>r B7</code></td><td><code>AC ← shr AC, AC(15) ← E, E ← AC(0), SC ← 0</code></td></tr>
<tr><td><strong>CIL</strong> (circulate left)</td><td><code>7040</code></td><td><code>r B6</code></td><td><code>AC ← shl AC, AC(0) ← E, E ← AC(15), SC ← 0</code></td></tr>
</tbody></table></div>
<ul class="clean">
<li><strong>CIR:</strong> AC = 0003 (…0011), E = 0 → old AC(0)=1 goes into E, old E=0 goes into AC(15) → <strong>AC = 0001, E = 1</strong>.</li>
<li><strong>CIL:</strong> AC = 8001, E = 0 → old AC(15)=1 goes into E, old E=0 goes into AC(0) → <strong>AC = 0002, E = 1</strong>.</li>
</ul>
<div class="callout tip"><strong>AC + E together behave like a 17-bit circular ring</strong>.</div>`
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
<tr><td><strong>ISZ</strong></td><td>110</td><td>D6</td><td>6xxx / Exxx</td><td><code>DR ← M[AR]+1</code>, store back, if 0 then <code>PC ← PC+1</code></td></tr>
</tbody></table></div>`
        },
        {
          h: 'Hex Decode Practice (exam style)',
          body: `<ul class="clean">
<li><code>7080</code>: opcode 111, I = 0 → register-reference, B7 set → <strong>CIR</strong>.</li>
<li><code>1940</code>: I = 0, opcode 001 → <strong>ADD direct</strong>, address 940.</li>
<li><code>B940</code>: B = 1011 → I = 1, opcode 011 → <strong>STA indirect</strong>, address 940.</li>
</ul>
<div class="callout tip">In the <strong>Lab tab</strong>, enter any 4-digit hex value and see its decoded result — good practice before the exam.</div>`
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
              { t: 'T0 — AR ← PC', body: `<p>The address of the next instruction goes from PC into AR.</p><div class="flow"><span class="flow-node on">PC</span><span class="flow-arrow">→</span><span class="flow-node on">AR</span></div>` },
              { t: 'T1 — IR ← M[AR], PC ← PC+1', body: `<p>The instruction comes from memory into IR and PC advances to the next address.</p><div class="flow"><span class="flow-node on">M[AR]</span><span class="flow-arrow">→</span><span class="flow-node on">IR</span><span class="flow-arrow">·</span><span class="flow-node on">PC+1</span></div>` },
              { t: 'T2 — Decode', body: `<p><code>IR(12-14) = 001</code> → opcode ADD → <strong>D1 = 1</strong>. <code>IR(0-11) = 940</code> → AR. <code>I = 0</code> → direct, skip T3.</p>` },
              { t: 'T4 — DR ← M[AR]', body: `<p>The operand (M[940] = 0003) first comes into DR — because memory data cannot go directly into the adder.</p><div class="flow"><span class="flow-node on">M[940]=0003</span><span class="flow-arrow">→</span><span class="flow-node on">DR</span></div>` },
              { t: 'T5 — AC ← AC + DR', body: `<p><code>AC = 0005 + 0003 = 0008</code>, carry out <code>E = 0</code>, <code>SC ← 0</code> (sequence counter reset → next fetch).</p><div class="callout tip">It was <strong>direct</strong>, so T3 did not occur. If it were indirect, <code>AR ← M[AR]</code> would happen at T3.</div>` }
            ]
          },
          {
            name: 'STA and Shift',
            steps: [
              { t: 'STA (D3) — T4', body: `<p><code>M[AR] ← AC, SC ← 0</code>. A single micro-operation — no need for DR, since we write directly from AC to memory.</p><div class="flow"><span class="flow-node on">AC</span><span class="flow-arrow">→</span><span class="flow-node on">M[AR]</span></div>` },
              { t: 'CIR (7080) — r B7', body: `<p><code>AC ← shr AC, AC(15) ← E, E ← AC(0), SC ← 0</code>. AC=0003, E=0 → <strong>AC=0001, E=1</strong>.</p>` },
              { t: 'CIL (7040) — r B6', body: `<p><code>AC ← shl AC, AC(0) ← E, E ← AC(15), SC ← 0</code>. AC=8001, E=0 → <strong>AC=0002, E=1</strong>.</p>` },
              { t: '17-bit ring', body: `<p><strong>AC (16 bits) + E (1 bit)</strong> form a circular ring — in CIR/CIL, no bit is lost.</p>` }
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
      blurb: 'Twos complement, overflow, Booth multiplication and restoring division — with worked steps.',
      sections: [
        {
          h: 'Integer Representation',
          body: `<p>A computer has only 0s and 1s, so for negative numbers the leftmost bit is the <strong>sign bit</strong> (0 = positive, 1 = negative).</p>
<ul class="clean">
<li><strong>Sign-magnitude:</strong> the remaining n−1 bits give the magnitude. Drawbacks: sign must be checked for add/subtract, and there are <strong>two zeros</strong> (+0 and −0).</li>
<li><strong>Twos complement:</strong> addition and subtraction are simpler — hence almost universal in processors.</li>
<li><strong>Range (n bits):</strong> <code>−2^(n−1)</code> to <code>2^(n−1) − 1</code>. 8 bits: <strong>−128 to +127</strong>.</li>
<li><strong>Sign extension:</strong> fill the new bits with copies of the sign bit (positive → 0s, negative → 1s).</li>
</ul>`
        },
        {
          h: 'Negation (Finding the Twos Complement)',
          body: `<ol class="steps">
<li>Complement every bit (including the sign bit).</li>
<li><strong>Add 1</strong> to the result.</li>
</ol>
<p><strong>Example:</strong> +18 = <code>00010010</code> → complement <code>11101101</code> → +1 = <code>11101110</code> = <strong>−18</strong>.</p>
<div class="callout warn"><strong>Special cases:</strong> Negating 0 gives 0. Negating <code>−128 (10000000)</code> gives <code>−128</code> again (wrong), because <code>+128</code> does not fit in 8 bits.</div>`
        },
        {
          h: 'Addition and Overflow',
          body: `<p>Addition is done like unsigned addition and the <strong>carry out of the top bit is ignored</strong>.</p>
<div class="callout tip"><strong>Overflow rule:</strong> If adding two positive or two negative numbers gives a result with the <strong>opposite</strong> sign, overflow has occurred.</div>
<p><strong>Example (8 bits):</strong> 100 + 50 = 150, out of range.</p>
<div class="bits-box"><div class="bits">01100100 &nbsp;(+100)<br>00110010 &nbsp;(+50)<br>--------<br>10010110 &nbsp;(negative!)</div></div>
<p>The sum of two positives came out negative → <strong>overflow</strong>.</p>`
        },
        {
          h: 'Subtraction',
          body: `<p>Take the twos complement of the subtrahend and add it to the minuend:</p>
<div class="formula">A − B = A + (−B)</div>`
        },
        {
          h: 'Unsigned Multiplication',
          body: `<p>Registers: <strong>M</strong> (multiplicand), <strong>Q</strong> (multiplier), <strong>A</strong> (initially 0), <strong>C</strong> (1-bit carry).</p>
<ol class="steps">
<li>If <code>Q0 = 1</code> → <code>A = A + M</code> (carry in C). Then <code>C, A, Q</code> together undergo a <strong>right shift</strong>.</li>
<li>If <code>Q0 = 0</code> → just shift.</li>
<li>Repeat n times — the 2n-bit product is in <code>A and Q</code>.</li>
</ol>
<p>This method fails for a negative multiplicand → <strong>Booth’s algorithm</strong>.</p>`
        },
        {
          h: "Booth’s Algorithm",
          body: `<p><code>Q−1</code> is an extra bit to the right of Q, initially <code>0</code>, and it always holds the bit just shifted out of Q. In each cycle, look at <code>Q0 Q−1</code>:</p>
<div class="tbl-wrap"><table><thead><tr><th>Q0 Q−1</th><th>Meaning</th><th>Action</th></tr></thead><tbody>
<tr><td><code>1 0</code></td><td>Start of a run of 1s</td><td><code>A = A − M</code>, then shift</td></tr>
<tr><td><code>0 1</code></td><td>End of a run of 1s</td><td><code>A = A + M</code>, then shift</td></tr>
<tr><td><code>0 0</code></td><td>Run of 0s</td><td>Just shift</td></tr>
<tr><td><code>1 1</code></td><td>Middle of a run of 1s</td><td>Just shift</td></tr>
</tbody></table></div>
<p>The shift is an <strong>arithmetic right shift</strong> (A, Q, Q−1 together; A's sign bit is copied).</p>
<div class="callout"><strong>Advantage:</strong> it works for both positive and negative numbers, and a block of 1s takes only one subtraction + one addition. For example, <code>3 = 0011 = +4 − 1</code>.</div>`
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
          body: `<p><strong>M</strong> = divisor, <strong>Q</strong> = dividend, <strong>A = 0</strong>. In each step:</p>
<ol class="steps">
<li><strong>Left shift</strong> A and Q.</li>
<li><code>A = A − M</code>.</li>
<li>If A is not negative → <code>Q0 = 1</code>.</li>
<li>If A is negative → <code>Q0 = 0</code> and <strong>restore</strong> A by adding M back.</li>
<li>After n steps, the quotient is in <strong>Q</strong> and the remainder is in <strong>A</strong>.</li>
</ol>
<p><strong>Example: 7 ÷ 3</strong> — <code>M = 0011, Q = 0111, A = 0000</code></p>
<div class="tbl-wrap"><table class="table-mono"><thead><tr><th>Step</th><th>(A, Q) after shift</th><th>A − M</th><th>Action</th><th>A, Q</th></tr></thead><tbody>
<tr><td>1</td><td>0000, 1110</td><td>negative</td><td>Q0=0, restore</td><td>0000, 1110</td></tr>
<tr><td>2</td><td>0001, 1100</td><td>negative</td><td>Q0=0, restore</td><td>0001, 1100</td></tr>
<tr><td>3</td><td>0011, 1000</td><td>0000</td><td>Q0=1</td><td>0000, 1001</td></tr>
<tr><td>4</td><td>0001, 0010</td><td>negative</td><td>Q0=0, restore</td><td>0001, 0010</td></tr>
</tbody></table></div>
<p>Quotient <code>0010 = 2</code>, remainder <code>0001 = 1</code> → <strong>7 ÷ 3 = 2 remainder 1 ✓</strong>.</p>
<div class="callout"><strong>Negative numbers:</strong> divide the magnitudes, then fix the signs at the end —<br><code>sign(R) = sign(dividend)</code><br><code>sign(Q) = sign(dividend) × sign(divisor)</code><br>Example: −7 ÷ 2 → Q = −3, R = −1.</div>`
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
              { t: 'Setup', body: `<p><code>A = 0000, Q = multiplier, Q−1 = 0, M = multiplicand</code>. n cycles run.</p>` },
              { t: 'Look at Q0 Q−1', body: `<p><code>10</code> → start of run → <strong>A = A − M</strong><br><code>01</code> → end of run → <strong>A = A + M</strong><br><code>00 / 11</code> → just shift.</p>` },
              { t: 'Arithmetic right shift', body: `<p>Right shift <code>A, Q, Q−1</code> together — A's sign bit is copied again. This is necessary for signed numbers.</p><div class="flow"><span class="flow-node on">A</span><span class="flow-arrow">→</span><span class="flow-node on">Q</span><span class="flow-arrow">→</span><span class="flow-node on">Q−1</span></div>` },
              { t: 'Result', body: `<p>After n cycles, <code>A Q</code> together form the 2n-bit product. <code>7 × 3 = 0001 0101 = 21</code>.</p>` },
              { t: 'What is the difference?', body: `<p>Simple unsigned multiplication fails for a negative multiplicand. Booth works for both signs and handles a block of 1s with a single add/subtract.</p>` }
            ]
          },
          {
            name: 'Restoring division',
            steps: [
              { t: 'Setup', body: `<p><code>A = 0, Q = dividend, M = divisor</code>. We work with magnitudes.</p>` },
              { t: 'Left shift', body: `<p>Left shift <code>A and Q</code> by one bit — Q's leftmost bit moves into A.</p><div class="flow"><span class="flow-node on">A</span><span class="flow-arrow">←</span><span class="flow-node on">Q</span></div>` },
              { t: 'A = A − M', body: `<p>Subtract. If the result is <strong>not negative</strong> → <code>Q0 = 1</code> (bit set). If <strong>negative</strong> → <code>Q0 = 0</code> and restore by adding M back.</p>` },
              { t: 'After n steps', body: `<p>Quotient <strong>Q</strong>, remainder <strong>A</strong>. <code>7 ÷ 3 → Q=2, A=1</code>.</p>` },
              { t: 'Fix the signs', body: `<p>If an input was negative, then at the end: <code>sign(R) = sign(dividend)</code>, <code>sign(Q) = sign(D) × sign(V)</code>. Example <code>−7 ÷ 2 → −3, −1</code>.</p>` }
            ]
          }
        ]
      },
      lab: 'arithmetic'
    }
  ],

  /* ---------------- Question bank ---------------- */
  questions: [
    { id:'q01', topic:'interrupts', q:'What is an interrupt?', o:['A signal sent to the processor so it can handle an event temporarily','A type of cache memory','A bit of the address bus','An assignment operator'], a:0, why:'An interrupt is a signal — a device/event tells the processor to handle it first.' },
    { id:'q02', topic:'interrupts', q:'What is the full form of ISR?', o:['Interrupt Service Routine','Internal System Register','Instruction Set Register','Interrupt Status Request'], a:0, why:'ISR = Interrupt Service Routine — the special program that handles the event.' },
    { id:'q03', topic:'interrupts', q:'When does the processor check for interrupts?', o:['After each instruction executes, before the next fetch','Only when the program starts','At the end of every clock cycle when granting the bus','Only on a cache miss'], a:0, why:'The interrupt cycle occurs after every instruction, before the next fetch.' },
    { id:'q04', topic:'interrupts', q:'What is saved in a context save?', o:['PC and processor state','Only the AC register','The entire main memory','Only cache lines'], a:0, why:'PC + the rest of the processor state are saved on the stack so the program can resume.' },
    { id:'q05', topic:'interrupts', q:'Main benefit of interrupts for slow I/O devices?', o:['The processor does not wait and keeps doing its own work','The data bus width increases','Memory capacity increases','The clock becomes faster'], a:0, why:'The device notifies the processor when it is ready — the processor avoids idle waiting.' },
    { id:'q06', topic:'interrupts', q:'Where does a timer interrupt come from?', o:["From the processor's internal timer",'From the printer','From the disk controller','From the power supply'], a:0, why:"The timer class comes from the processor's internal timer at regular intervals." },
    { id:'q07', topic:'interrupts', q:'What is the drawback of the "disable interrupts" approach?', o:['Does not consider priority','Requires a stack','It is very slow','The ISR cannot run'], a:0, why:'It is simple but does not serve an urgent high-priority device quickly.' },
    { id:'q08', topic:'interrupts', q:'In the example from the notes, which interrupt arrived at t=15?', o:['Communications (priority 5)','Printer (priority 2)','Disk (priority 4)','Timer'], a:0, why:'At t=15, communications arrived, with priority 5 > printer priority 2.' },
    { id:'q09', topic:'interrupts', q:'How do interrupted routines resume in priority nesting?', o:['Reverse order (LIFO stack)','In the order they arrived','Only the highest-priority one','Random order'], a:0, why:'The stack works like LIFO — first communications, then printer, then user program.' },
    { id:'q10', topic:'interrupts', q:'What happens if context save is not done?', o:['The program cannot resume','The ISR will run faster','No bus grant will occur','The cache will be flushed'], a:0, why:'Without a saved PC/state, returning to the same point is impossible.' },

    { id:'q11', topic:'dma', q:'Who moves the data in DMA?', o:['DMA controller','Processor, word by word','ALU','Cache memory'], a:0, why:'The DMA controller transfers data directly between the device and memory.' },
    { id:'q12', topic:'dma', q:'When is the processor involved in a DMA transfer?', o:['Only at the start and end','For every word','For every bus cycle','Never'], a:0, why:'Setup and the completion interrupt — these are the only two points where the CPU is involved.' },
    { id:'q13', topic:'dma', q:'What is the function of the word count register?', o:['How many words to transfer','The starting memory address','The device name','Read/write direction'], a:0, why:'The word count is decremented — when it reaches zero, the transfer is complete.' },
    { id:'q14', topic:'dma', q:'What is cycle stealing?', o:['The controller takes one cycle between CPU bus cycles, without saving context','The controller holds the entire block','The CPU saves its context','The memory controller breaks the bus'], a:0, why:'Short pauses, but no context save — this is the difference between DMA and an interrupt.' },
    { id:'q15', topic:'dma', q:'What does burst mode do?', o:['Holds the bus until the whole block is transferred','Releases the bus after each word','Interrupts the processor for every word','Flushes the cache'], a:0, why:'In burst mode, the controller holds the bus until the entire block is done.' },
    { id:'q16', topic:'dma', q:'DMA is best for what?', o:['Large block transfers (disk, network)','Small occasional transfers','Only register moves','Only cache hits'], a:0, why:'Setup cost is paid once — so efficiency is higher for large blocks.' },
    { id:'q17', topic:'dma', q:'DMA vs interrupt — which statement is correct?', o:['DMA does not save context; interrupt does','Both save context','An ISR runs for every word in DMA','Bus cycles are stolen in an interrupt'], a:0, why:'Interrupt: instruction-level + context save. DMA: bus-cycle-level, no context save.' },
    { id:'q18', topic:'dma', q:'When does bus grant occur?', o:['At the end of the current bus cycle','Immediately with the request','After every instruction','On a cache miss'], a:0, why:'The CPU releases the bus only after finishing its current bus cycle.' },
    { id:'q19', topic:'dma', q:'What does the DMA controller do when the transfer is complete?', o:['Releases the bus and sends an interrupt to the CPU','Saves the CPU context','Increases the word count','Formats the memory'], a:0, why:'Step 6 — the done interrupt tells the CPU that the data is ready.' },

    { id:'q20', topic:'cache', q:'What does a cache hit mean?', o:['The word was found in the cache; the system bus is not used','The word was not found in memory','A block was replaced','The tag comparison failed'], a:0, why:'On a hit, data is available immediately — the memory bus is not used.' },
    { id:'q21', topic:'cache', q:'Where is the logical (virtual) cache located?', o:['Before the MMU','After the MMU','After memory','Outside the bus'], a:0, why:'A virtual cache looks up before translation — hence faster.' },
    { id:'q22', topic:'cache', q:'What is the formula for direct mapping?', o:['i = j mod m','set = j mod v','i = j × m','i = m mod j'], a:0, why:'In direct mapping, block j goes only to line i = j mod m.' },
    { id:'q23', topic:'cache', q:'24-bit address, 4-byte block, 16K lines — tag bits in direct mapping?', o:['8','14','2','10'], a:0, why:'Word=2, Line=14 → Tag = 24−14−2 = 8 bits.' },
    { id:'q24', topic:'cache', q:'In the example above, tag bits for 2-way set associative?', o:['9','8','13','22'], a:0, why:'Sets = 16K/2 = 8K = 2¹³ → Tag = 24−13−2 = 9 bits.' },
    { id:'q25', topic:'cache', q:'Tag bits in a fully associative cache?', o:['22','8','9','14'], a:0, why:'No index bits — Tag = 24−2 = 22 bits.' },
    { id:'q26', topic:'cache', q:'Conflict misses are more common in which mapping?', o:['Direct mapping','Fully associative','Two-way set associative','Victim cache'], a:0, why:'In direct mapping, each block has only one place — hence conflicts.' },
    { id:'q27', topic:'cache', q:'What does LRU replace?', o:['The block that has been unused the longest','The most recently loaded block','The least referenced block','A random block'], a:0, why:'LRU = Least Recently Used; FIFO replaces the oldest, LFU the least frequently used.' },
    { id:'q28', topic:'cache', q:'What is the write back policy?', o:['Only the cache is updated; memory is written when the block is replaced','Every write goes to both cache and memory','Write only to memory, ignore the cache','Disables write operations'], a:0, why:'Write through writes to both; write back writes to memory only on replacement.' },
    { id:'q29', topic:'cache', q:'What is the function of a victim cache?', o:['Reduce conflict misses of a direct-mapped L1','Increase memory capacity','Perform MMU replacement','Increase write traffic'], a:0, why:'A small fully associative cache (4–16 lines) between L1 and the next level.' },
    { id:'q30', topic:'cache', q:'C=1, M=17, h=0.9 → average access time?', o:['2.6 cycles','1.7 cycles','18 cycles','0.9 cycles'], a:0, why:'0.9(1) + 0.1(17) = 0.9 + 1.7 = 2.6 cycles.' },
    { id:'q31', topic:'cache', q:'Memory 500 cycles, L1 hit 0.95 — L1 only CPI?', o:['26','501','25','4.75'], a:0, why:'1 + 0.05 × 500 = 26.' },
    { id:'q32', topic:'cache', q:'L1 (h=0.95) + L2 (h2=0.90, 25 cycles), memory 500 — CPI?', o:['4.75','26','501','75'], a:0, why:'1 + 0.05(25 + 0.10×500) = 1 + 0.05(75) = 4.75.' },

    { id:'q33', topic:'registers', q:'What is the size of AR (Address Register)?', o:['12 bits','16 bits','8 bits','1 bit'], a:0, why:'AR and PC are 12-bit; DR, AC, IR, TR are 16-bit; INPR/OUTR are 8-bit.' },
    { id:'q34', topic:'registers', q:'Which register holds the address of the next instruction?', o:['PC','AR','DR','TR'], a:0, why:'The Program Counter (PC) holds the address of the next instruction.' },
    { id:'q35', topic:'registers', q:'What should S2 S1 S0 be for AR ← PC?', o:['010','001','100','111'], a:0, why:'010 selects PC onto the bus — and enables the LD of AR.' },

    { id:'q36', topic:'registers', q:'Which statement about INPR and OUTR is correct?', o:['INPR puts data on the bus; OUTR only receives','Both only receive','Both put data on the bus','OUTR puts data on the bus'], a:0, why:'INPR → AC → OUTR — the output register only receives.' },
    { id:'q37', topic:'registers', q:'The address input of memory is always connected to what?', o:['AR','PC','DR','AC'], a:0, why:'For every memory read/write, the address comes from AR.' },

    { id:'q38', topic:'buses', q:'What does the width of the address bus determine?', o:['Maximum memory capacity','The measure of data transfer speed','Clock frequency','Instruction count'], a:0, why:'An n-bit address bus → 2ⁿ addressable locations.' },
    { id:'q39', topic:'buses', q:'How many locations can a 12-bit address bus address?', o:['4096','1024','2048','8192'], a:0, why:'2¹² = 4096 locations (4K words).' },
    { id:'q40', topic:'buses', q:'How big is a QPI phit?', o:['20 bits','80 bits','72 bits','8 bits'], a:0, why:'The physical layer unit phit = 20 bits.' },
    { id:'q41', topic:'buses', q:'What is a QPI flit?', o:['80 bits = 72 payload + 8 CRC','20 bits signal unit','64-bit data word','12-bit address'], a:0, why:'The link layer flit is 80 bits — 72 payload and 8 CRC.' },
    { id:'q42', topic:'buses', q:'How many layers does QPI have?', o:['4','3','2','5'], a:0, why:'Physical, Link, Routing, Protocol — 4 layers.' },
    { id:'q43', topic:'buses', q:'Difference between PCIe and QPI lanes?', o:['A PCIe lane is bidirectional; a QPI lane is one-directional','QPI is bidirectional; PCIe is one-directional','Both are bidirectional','Both are one-directional'], a:0, why:'PCIe lanes are bidirectional; a QPI lane is directional.' },
    { id:'q44', topic:'buses', q:'What do timing signals on the control bus indicate?', o:['When data is valid','The size of the data','Memory capacity','The device name'], a:0, why:'Timing signals indicate validity; command signals indicate the operation.' },

    { id:'q45', topic:'instructions', q:'Where is the I bit in the 16-bit instruction of the basic computer?', o:['IR(15)','IR(12-14)','IR(0-11)','IR(8)'], a:0, why:'IR(15) = I (mode), IR(12–14) = opcode, IR(0–11) = address.' },
    { id:'q46', topic:'instructions', q:'How many bits is the opcode?', o:['3 bits','1 bit','12 bits','16 bits'], a:0, why:'IR(12–14) — a 3-bit opcode, fed to a 3-to-8 decoder.' },
    { id:'q47', topic:'instructions', q:'What happens at T1 in the fetch cycle?', o:['IR ← M[AR], PC ← PC+1','AR ← PC','Decode opcode','AC ← AC + DR'], a:0, why:'T0: AR←PC; T1: IR←M[AR], PC←PC+1; T2: decode.' },
    { id:'q48', topic:'instructions', q:'Where do memory-reference instructions start executing?', o:['At T4','At T0','At T2','Only at T3'], a:0, why:'After decode at T2, memory-reference instructions start execution at T4.' },
    { id:'q49', topic:'instructions', q:'What is the decoder output for LDA?', o:['D2','D1','D3','D7'], a:0, why:'LDA opcode 010 → D2; STA 011 → D3; ADD 001 → D1.' },
    { id:'q50', topic:'instructions', q:'What is the micro-operation for STA?', o:['M[AR] ← AC','AC ← DR','AC ← AC + DR','DR ← M[AR]'], a:0, why:'STA: D3 T4 → M[AR] ← AC, SC ← 0.' },
    { id:'q51', topic:'instructions', q:'Where is the carry saved in ADD?', o:['In the E register','In PC','In AR','In IR'], a:0, why:'D1 T5: AC ← AC + DR, E ← Cout.' },
    { id:'q52', topic:'instructions', q:'What is the hex code for CIR (circulate right)?', o:['7080','7040','1940','B940'], a:0, why:'CIR = 7080 (r B7); CIL = 7040 (r B6).' },
    { id:'q53', topic:'instructions', q:'CIL (7040), AC=8001, E=0 — what is the result?', o:['AC=0002, E=1','AC=0001, E=1','AC=4000, E=0','AC=8002, E=0'], a:0, why:'shl → 0002; old AC(15)=1 → E=1; old E=0 → AC(0)=0.' },
    { id:'q54', topic:'instructions', q:'What is instruction 1940?', o:['ADD direct, address 940','STA indirect, address 940','LDA direct, address 940','CIR'], a:0, why:'1 = opcode 001 (ADD), I=0 → direct, address 940.' },
    { id:'q55', topic:'instructions', q:'What is instruction B940?', o:['STA indirect, address 940','ADD direct, 940','LDA indirect, 940','I/O instruction'], a:0, why:'B = 1011 → I=1, opcode 011 (STA), address 940.' },
    { id:'q56', topic:'instructions', q:'Control function for register-reference instructions?', o:['r = D7 I’ T3','p = D7 I T3','D1 T5','D2 T4'], a:0, why:'7xxx → r = D7 I’ T3; Fxxx → p = D7 I T3.' },

    { id:'q57', topic:'arithmetic', q:'What is the 8-bit twos complement range?', o:['−128 to +127','−127 to +127','−128 to +128','0 to 255'], a:0, why:'Range = −2^(n−1) to 2^(n−1)−1 → −128 … +127.' },
    { id:'q58', topic:'arithmetic', q:'8-bit twos complement binary for +18?', o:['00010010','11101110','00010001','10010010'], a:0, why:'A positive number is plain binary — 18 = 16+2 = 00010010.' },
    { id:'q59', topic:'arithmetic', q:'8-bit twos complement for −18?', o:['11101110','00010010','11101101','10010010'], a:0, why:'00010010 → complement 11101101 → +1 = 11101110.' },
    { id:'q60', topic:'arithmetic', q:'What is the overflow rule?', o:['Same-sign operands giving an opposite-sign result','Carry out is always overflow','Only for negative numbers','sign bit 0'], a:0, why:'Add same signs, result sign flips → overflow. Carry out is ignored.' },
    { id:'q61', topic:'arithmetic', q:'How do we do A − B in twos complement?', o:['A + (−B)','A + B','A × B','B − A'], a:0, why:'Take the twos complement of the subtrahend and add it.' },
    { id:'q62', topic:'arithmetic', q:'In Booth algorithm, what happens at Q0 Q−1 = 10?', o:['A = A − M, then shift','A = A + M, then shift','Just shift','Nothing'], a:0, why:'10 = start of a run of 1s → subtract then shift.' },
    { id:'q63', topic:'arithmetic', q:'In Booth algorithm, what happens at Q0 Q−1 = 01?', o:['A = A + M, then shift','A = A − M, then shift','Just shift','Set carry'], a:0, why:'01 = end of a run → add then shift.' },
    { id:'q64', topic:'arithmetic', q:'Booth result for 7 × 3 (A Q)?', o:['0001 0101 = 21','0010 1010 = 42','0000 0111 = 7','1110 1001 = negative'], a:0, why:'After 4 cycles A=0001, Q=0101 → 00010101 = 21.' },
    { id:'q65', topic:'arithmetic', q:'In restoring division, if A becomes negative?', o:['Q0 = 0 and restore by adding M back','Q0 = 1 and continue','Immediate overflow','Shift left'], a:0, why:'Negative means the subtract failed — Q0=0 and restore A.' },
    { id:'q66', topic:'arithmetic', q:'Quotient and remainder for 7 ÷ 3?', o:['Q=2, R=1','Q=1, R=2','Q=3, R=0','Q=2, R=3'], a:0, why:'Restoring division example — Q=0010 (2), A=0001 (1).' },
    { id:'q67', topic:'arithmetic', q:'Which sign rule is correct for −7 ÷ 2?', o:['Q=−3, R=−1','Q=3, R=1','Q=−3, R=1','Q=3, R=−1'], a:0, why:'sign(Q)=sign(D)×sign(V), sign(R)=sign(dividend) → −3, −1.' },
    { id:'q68', topic:'arithmetic', q:'When sign-extending a negative number, what is filled in?', o:['1s','0s','Alternate bits','Remove the sign bit'], a:0, why:'A negative number has sign bit 1 — fill new bits with 1s too.' },
    { id:'q69', topic:'arithmetic', q:'What is the negation of −128 in 8 bits (incorrect result)?', o:['−128 itself','+128','0','−127'], a:0, why:'+128 is outside the 8-bit range — remember this special case.' }
  ],

  /* ---------------- Quick revision sheet ---------------- */
  revision: [
    { topic:'Interrupts', fact:'Check after instruction → context save → ISR → restore' },
    { topic:'DMA', fact:'Processor only at start and end; cycle stealing; no context save' },
    { topic:'Direct mapping', fact:'i = j mod m; Tag (s−r), Line (r), Word (w)' },
    { topic:'Set-associative', fact:'Set = j mod v; Tag (s−d), Set (d), Word (w)' },
    { topic:'Avg access time', fact:'t = h·C + (1−h)·M' },
    { topic:'Fetch', fact:'T0: AR←PC · T1: IR←M[AR], PC←PC+1 · T2: decode' },
    { topic:'LDA / STA / ADD', fact:'D2, D3, D1 (T4, T5)' },
    { topic:'CIR / CIL', fact:'7080 / 7040 — AC and E act like a 17-bit ring' },
    { topic:'Register / I/O', fact:'r = D7 I’ T3 (7xxx) / p = D7 I T3 (Fxxx)' },
    { topic:'QPI units', fact:'Phit 20 bits · Flit 80 bits (72 payload + 8 CRC)' },
    { topic:'Twos complement', fact:'−2^(n−1) to 2^(n−1) − 1' },
    { topic:'Overflow', fact:'Same-sign operands, opposite-sign result' },
    { topic:'Booth', fact:'10 → A−M · 01 → A+M · 00/11 → shift' },
    { topic:'Division signs', fact:'sign(R)=sign(dividend); sign(Q)=sign(D)×sign(V)' }
  ],

  plan: [
    'Memorize the interrupt + DMA tables and cycles',
    'Cache: mapping formulas, numericals, write policy',
    'Instruction fetch timing + hex decode practice',
    'Revise registers, buses, QPI/PCIe tables',
    'Binary arithmetic: Booth and division worked examples',
    'Take 2 full mock tests — target 80%+'
  ]
};




