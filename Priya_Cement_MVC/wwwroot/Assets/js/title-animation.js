document.addEventListener("DOMContentLoaded", () => {

  function splitText(el) {
    const chars = [];
    const frag = document.createDocumentFragment();
    let currentWord = null;

    function flushWord() {
      if (currentWord && currentWord.childNodes.length) {
        frag.appendChild(currentWord);
      }
      currentWord = null;
    }

    function newWord() {
      const w = document.createElement("span");
      w.className = "word";
      w.style.display = "inline-block";
      return w;
    }

    function addChar(letter, highlight) {
      if (!currentWord) currentWord = newWord();
      const c = document.createElement("span");
      c.className = "char" + (highlight ? " highlight" : "");
      c.textContent = letter;
      c.style.display = "inline-block";
      currentWord.appendChild(c);
      chars.push(c);
    }

    function processText(text, highlight) {
      text.split(/(\s+)/).forEach((part) => {
        if (part === "") return;
        if (/^\s+$/.test(part)) {
          flushWord();
          frag.appendChild(document.createTextNode(" "));
        } else {
          [...part].forEach((letter) => addChar(letter, highlight));
        }
      });
    }

    function walk(node, highlight) {
      node.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          processText(child.textContent, highlight);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          walk(child, highlight || child.tagName === "SPAN");
        }
      });
    }

    walk(el, false);
    flushWord();

    el.textContent = "";
    el.appendChild(frag);

    return { chars };
  }

  const splitTypes = document.querySelectorAll(".reveal-text");

  splitTypes.forEach((container) => {
    const { chars } = splitText(container);
    const total = chars.length;

    ScrollTrigger.create({
      trigger: container,
      start: "top 80%",
      end: "top 20%",
      scrub: true,
      markers: false,
      onUpdate: (self) => {
        const progress = self.progress; // 0 -> 1 as you scroll through the range
        chars.forEach((c, i) => {
          const charThreshold = i / total; // each char's own "turn" in sequence
          if (progress >= charThreshold) {
            c.classList.add("revealed");
          } else {
            c.classList.remove("revealed");
          }
        });
      },
    });
  });

});