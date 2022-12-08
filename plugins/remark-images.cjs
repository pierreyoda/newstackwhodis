const unistUtilVisitPkg = import("unist-util-visit");
const { visit } = unistUtilVisitPkg;

const TO_CAMEL_CASE_REGEX = /(?:^\w|[A-Z]|\b\w)/g;
/**
 * @param {string} str
 * @returns string
 */
const toCamelCase = str =>
  str
    .replace(TO_CAMEL_CASE_REGEX, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase()))
    .replace(/\s+/g, "");

// TODO: find better way
const REMARK_SCRIPT_START = /<script(?:\s+?[a-zA-z]+(=(?:["']){0,1}[a-zA-Z0-9]+(?:["']){0,1}){0,1})*\s*?>/;

// TODO: use sharp library for image optimization?
/**
 * Custom Vite + Remark plugin to handle MDsveX relative images paths in a blog article.
 *
 * Heavily inspired from a GitHub discussion on MDsveX (no explicit license from what I've read):
 *
 * @see https://github.com/pngwn/MDsveX/discussions/246#discussioncomment-720947
 */
const RemarkImagesMDsveXPlugin = () => {
  const transformer = tree => {
    /** @type Record<string, { if: string; path: string }> */
    const images = {};
    /** @type Record<string, number> */
    const imagesCounts = {};

    visit(tree, "image", node => {
      /** @type string */
      const url = url;
      let camelUrl = toCamelCase(url);
      const count = imagesCounts[url] ?? 0;
      const duplicated = images[url];

      if (count && !duplicated) {
        imagesCounts[url] = count + 1;
        camelUrl = `${camelUrl}_${count}`;
      } else if (!duplicated) {
        imagesCounts[camelUrl] = 1;
      }

      images[url] = {
        id: camelUrl,
        path: url,
      };

      node.url = `{${camelUrl}}`;
    });

    let scripts = "";
    for (const { id, path } of Object.values(images)) {
      scripts += `import ${id} from "${path}"\n`;
    }

    let isScript = false;
    visit(tree, "html", node => {
      if (!REMARK_SCRIPT_START.test(node.value)) {
        return;
      }
      isScript = true;
      node.value = node.value.replace(REMARK_SCRIPT_START, script => `${script}\n${scripts}`);
    });

    if (isScript) {
      return;
    }

    tree.children.push({
      type: "html",
      value: `<script>\n${scripts}\n</script>`,
    });
  };

  return transformer;
};

module.exports = { RemarkImagesMDsveXPlugin };
