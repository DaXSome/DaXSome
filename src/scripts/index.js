import * as cheerio from "cheerio";
import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";

(async function () {
  const thisYear = new Date().getFullYear();

  const academicYear = `${thisYear - 1}-${thisYear}`;

  console.log(`[+] Getting data for ${academicYear} academic year`);

  const yearApplicantsFile = join("data", `${academicYear}.json`);

  let index = 1;

  if (existsSync(yearApplicantsFile)) {
    const buffer = readFileSync(yearApplicantsFile);

    const data = JSON.parse(buffer.toString());

    index = data.index_snapshot;
  } else {
    writeFileSync(
      yearApplicantsFile,
      JSON.stringify({ index_snapshot: index, applicants: [] }, null, 2),
    );
  }

  let threshold = 5;

  let done = false;

  while (!done) {
    console.log(`[+] Current page => ${index}`);

    const pageRes = await fetch(
      `https://apps.knust.edu.gh/admissions/check/Home/ApplicantList?offer=1&streamid=1&page=${index}`,
    );

    const pageText = await pageRes.text();

    const $ = cheerio.load(pageText);

    const rows = $("tr");

    /**
     * @type {{ name: string; programme: string; }[]}
     */
    const applicants = [];

    rows.each((_, el) => {
      const data = $(el).find("td");

      const name = $(data[2]).text();
      const programme = $(data[3]).text();

      if (name !== "" && programme !== "") {
        const isObuasi = programme.toLowerCase().includes("obuasi");

        const [degree, course] = programme.split(". ");

        applicants.push({
          name,
          degree,
          course,
          campus: isObuasi ? "obuasi" : "main",
        });

        console.log(`[+] ${name} - ${degree} (${course})`);
      }
    });

    index += 1;
    done = rows.length < 2;
    threshold -= 1;

    const buffer = readFileSync(yearApplicantsFile);

    const data = JSON.parse(buffer.toString());

    writeFileSync(
      yearApplicantsFile,
      JSON.stringify(
        {
          index_snapshot: index,
          applicants: [...data.applicants, ...applicants],
        },
        null,
        2,
      ),
    );

    if (threshold === 0) {
      console.log("[!] Threshold reached. Sleeping for 10 seconds");

      threshold = 5;

      await new Promise((resolve) => {
        setTimeout(() => resolve(true), 10000);
      });
    }
  }
})();
