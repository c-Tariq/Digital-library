#! /usr/bin/env node

const db = require("./query");
const pool = require("./pool");

async function addNewBooks() {
  try {
    console.log("Adding new books...");

    await db.addPublisher("مؤسسة هينداوي");

    // ─── Add Authors ──────────────────────────────────
    await db.addAuthor(
      "مصطفى كامل",
      "مصطفى كامل – زعيم وطني مصري، من أبرز دعاة الاستقلال عن الاحتلال البريطاني. اشتهر بخطبه ومقالاته الوطنية، وأسس الحزب الوطني."
    );

    await db.addAuthor(
      "سيف الدين عَمّوص",
      "سيف الدين عَمّوص – خبير اقتصادي فلسطيني. درس في بيروت ولندن وكولومبيا، متخصص في اقتصاديات الطاقة والبيتكوين، وعمل أستاذًا في جامعات كولومبيا ولبنان."
    );

    await db.addAuthor(
      "أحمد أمين",
      "أحمد أمين – مفكر ومؤرخ إسلامي مصري، دعا للتجديد والوسطية. أبرز أعماله «فجر الإسلام»، «ضحى الإسلام»، و«ظهر الإسلام». توفي عام 1954م."
    );

    await db.addAuthor(
      "مصطفى لطفي المنفلوطي",
      "مصطفى لطفي المنفلوطي – أديب مصري شهير بأسلوبه الراقي والعاطفي. حفظ القرآن صغيرًا ودرس بالأزهر وتأثر بالإمام محمد عبده. عُرف بكتبيه «النظرات» و«العبرات». توفي عام 1924م."
    );

    // ─── Add Categories ───────────────────────────────
    await db.addCategory("تاريخ");
    await db.addCategory("سيرة سياسية");
    await db.addCategory("اقتصاد");
    await db.addCategory("تكنولوجيا مالية");
    await db.addCategory("سيرة ذاتية");
    await db.addCategory("فكر وثقافة");
    await db.addCategory("أدب");
    await db.addCategory("فكر اجتماعي");

    // Get author IDs (you'll need to query or track them)
    // For now, assuming they're added in order: 9, 10, 11, 12
    // Get category IDs similarly

    // ─── Add Books ────────────────────────────────────
    const book1 = await db.addBook(
      "فتح الأندلس",
      1,
      "يتناول الكتاب تاريخ الفتح الإسلامي للأندلس، والأحداث السياسية والعسكرية التي رافقت ذلك، مع إبراز دور القادة المسلمين في نشر الحضارة الإسلامية بأوروبا.",
      "uploads/books/Fath_Alandlus.pdf"
    );

    const book2 = await db.addBook(
      "معيار البيتكوين",
      1,
      "يشرح الكتاب فكرة البيتكوين كعملة رقمية لا مركزية تحافظ على قيمتها وتمنع التضخم بفضل محدودية المعروض (21 مليون). يرى المؤلف أن البيتكوين بديل عن الذهب والبنوك، لأنه يسمح بنقل الأموال عالميًا بسرعة وأمان دون وسطاء.",
      "uploads/books/The_Bitcoin_Standard.pdf"
    );

    const book3 = await db.addBook(
      "حياتي",
      1,
      "سيرة ذاتية يروي فيها أحمد أمين مراحل حياته منذ الطفولة والدراسة بالأزهر حتى عمله أستاذًا وعميدًا لكلية الآداب. يعرض تجربته الشخصية ومشاهداته للحياة الفكرية والاجتماعية في مصر أواخر القرن التاسع عشر وبدايات العشرين.",
      "uploads/books/Hayaty.pdf"
    );

    const book4 = await db.addBook(
      "النظرات",
      1,
      "مجموعة مقالات اجتماعية ودينية وسياسية تدعو للإصلاح الأخلاقي، ونبذ الجهل والخرافات، والتمسك بالدين والوطن. تناول فيها قضايا المرأة، وهاجم الممارسات الدينية الخاطئة، وأشاد بسعد زغلول.",
      "uploads/books/Nazarat.pdf"
    );

    // ─── Link Book Authors ─────────────────────────────
    await db.addBookAuthor(book1.id, 1); // مصطفى كامل
    await db.addBookAuthor(book2.id, 2); // سيف الدين عَمّوص
    await db.addBookAuthor(book3.id, 3); // أحمد أمين
    await db.addBookAuthor(book4.id, 4); // مصطفى لطفي المنفلوطي

    // ─── Link Book Categories ──────────────────────────
    await db.addBookCategory(1, 1); // فتح الأندلس -> تاريخ
    await db.addBookCategory(1, 2); // فتح الأندلس -> سيرة سياسية

    await db.addBookCategory(2, 3); // معيار البيتكوين -> اقتصاد
    await db.addBookCategory(2, 4); // معيار البيتكوين -> تكنولوجيا مالية

    await db.addBookCategory(3, 5); // حياتي -> سيرة ذاتية
    await db.addBookCategory(3, 6); // حياتي -> فكر وثقافة

    await db.addBookCategory(4, 7); // النظرات -> أدب
    await db.addBookCategory(4, 8); // النظرات -> فكر اجتماعي

    console.log("New books added successfully!");
  } catch (err) {
    console.error("Error adding books:", err);
  } finally {
    await pool.end();
  }
}

addNewBooks();
