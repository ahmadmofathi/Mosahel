import { Component } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrl: './policy.component.css',
  animations: [
    trigger('toggleAnswer', [
      state('void', style({
        height: '0',
        opacity: 0,
        overflow: 'hidden'
      })),
      state('*', style({
        height: '*',
        opacity: 1,
        overflow: 'hidden'
      })),
      transition('void <=> *', [
        animate('100ms ease-in-out')
      ])
    ])
  ]
})
export class PolicyComponent {
  faqItems: any[];
  constructor(
    private sanitizer: DomSanitizer
  ) { 
    this.faqItems = [
    { question: "الدليل الإرشادي منصة المسار الصحيح",
      answer: this.sanitizer.bypassSecurityTrustHtml(`<p dir="rtl"><strong><span style="unicode-bidi: embed; direction: rtl;">1. تسجيل الدخول إلى المنصة</span></strong></p>
<p>
  قم بالدخول إلى الرابط:<br>
  🔗 <a href="https://righttrack.com.sa" target="_blank">https://righttrack.com.sa</a><br>
  ثم أدخل بريدك الإلكتروني وكلمة المرور.
</p>

<p dir="rtl"><strong><span style="unicode-bidi: embed; direction: rtl;">2. اختيار الدورة التدريبية</span></strong></p>
<p>
  بعد تسجيل الدخول، اختر الدورة المطلوبة من القائمة، ثم اضغط على "تسجيل".
</p>

<p dir="rtl"><strong><span style="unicode-bidi: embed; direction: rtl;">3. بدء التدريب والدخول إلى الفصل الافتراضي</span></strong></p>
<p>
  بعد التسجيل، اضغط على زر "بدء التدريب" أو "الدخول إلى الفصل الافتراضي" باستخدام نظام Zoom.
</p>

<p dir="rtl"><strong><span style="unicode-bidi: embed; direction: rtl;">4. التفاعل مع المحتوى</span></strong></p>
<p>
  يحتوي المحتوى على ملفات PDF، فيديوهات، واختبارات قصيرة. يجب إكمال الوحدات بالتسلسل.
</p>

<p dir="rtl"><strong><span style="unicode-bidi: embed; direction: rtl;">5. أداء المهام والاختبارات</span></strong></p>
<p>
  تظهر المهام أسفل المحتوى. قم بحلها ورفع الإجابات ليتم تقييمها تلقائيًا أو من المدرب.
</p>

<p dir="rtl"><strong><span style="unicode-bidi: embed; direction: rtl;">6. متابعة التقدم</span></strong></p>
<p>
  من خلال "لوحة التقدم" يمكنك معرفة نسبة الإنجاز والنقاط لكل وحدة.
</p>

<p dir="rtl"><strong><span style="unicode-bidi: embed; direction: rtl;">7. التواصل مع المدرب والدعم الفني</span></strong></p>
<p>للتواصل:</p>
<ul class="text-end">
  <li>زر "رسالة للمدرب" داخل المنصة</li>
  <li>البريد الإلكتروني: <a href="mailto:info@righttrack.com.sa">info@righttrack.com.sa</a></li>
  <li>الهاتف / واتساب: 0550025104</li>
</ul>
`),
  open: false },
    { question: " الهيكل التنظيمي للأدوار والمسؤوليات",
      answer: this.sanitizer.bypassSecurityTrustHtml(`
        <table border="1" dir="rtl">
          <thead style="background-color: #89CFF0; color: white;">
            <tr>
              <th style="padding: 8px;">الاسم</th>
              <th style="padding: 8px;">المسمى الوظيفي</th>
              <th style="padding: 8px;">المهام</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 8px;">
              مبروك
              </td>
              <td style="padding: 8px;">
              المدير العام للمركز
              </td>
              <td style="padding: 8px;">
                العمل على تطوير برامج التعليم، ضبط الجودة، استراتيجيات التعليم، والتقنية
              </td>
            </tr>
            <tr>
              <td style="padding: 8px;">مها</td>
              <td style="padding: 8px;">منسق البرامج التدريبية</td>
              <td style="padding: 8px;">
                تخطيط وتنظيم البرامج الإلكترونية والتنسيق مع المدربين والمتدربين
              </td>
            </tr>
            <tr>
              <td style="padding: 8px;">ابتسام</td>
              <td style="padding: 8px;">أخصائية الدعم الفني والتقني</td>
              <td style="padding: 8px;">
                إدارة المنصة التدريبية، دعم المتدربين، ومعالجة الأعطال الفنية والتقنية
              </td>
            </tr>
            <tr>
              <td style="padding: 8px;">موضي</td>
              <td style="padding: 8px;">مسؤولة المتابعة والتقييم</td>
              <td style="padding: 8px;">
                متابعة الحضور، مراقبة التفاعل، إعداد تقارير الأداء، ومتابعة تقدم المتدربين
              </td>
            </tr>
            <tr>
              <td style="padding: 8px;">أمية</td>
              <td style="padding: 8px;">مدربة/المشرفة التعليمية</td>
              <td style="padding: 8px;">
                تنفيذ محتوى التدريب، التفاعل مع المتدربين، والإشراف على سير العملية التدريبية
              </td>
            </tr>
          </tbody>
        </table>
      `), open: false },
      {
  question: "آلية التحقق من هوية المستفيد في بيئة التدريب الإلكترونية",
  answer: `
    <div class="text-end">
      <p><strong>أولاً: أثناء التسجيل في مركز المسار الصحيح للتدريب:</strong></p>
      <ol>
        <li>يُطلب من المتدرب رفع صورة من الهوية الوطنية أو الإقامة عند التسجيل.</li>
        <li>يتم التحقق من مطابقة الاسم والبيانات المدخلة مع الهوية الرسمية.</li>
        <li>لا يتم تفعيل حساب المتدرب حتى يتم اعتماد هويته من قبل الإدارة.</li>
      </ol>

      <p><strong>ثانياً: أثناء حضور البرامج التدريبية:</strong></p>
      <ol>
        <li>يُستخدم بريد إلكتروني رسمي مخصص لكل متدرب لتسجيل الدخول إلى المنصة.</li>
        <li>تُستخدم أنظمة لمتابعة نشاط الدخول والخروج (Logs) داخل المنصة.</li>
        <li>في البرامج التي تتجاوز مدتها 30 يومًا، قد يُطلب توقيع صوتي أو تسجيل فيديو قصير للتأكيد.</li>
      </ol>

      <p><strong>ثالثاً: أثناء التقييمات والاختبارات:</strong></p>
      <ol>
        <li>يُفعل نظام الأسئلة العشوائية مع توقيت زمني محدد.</li>
        <li>بعض التقييمات تتطلب حضورًا عبر Zoom أو Google Meet لمراقبة المتدرب.</li>
        <li>في حالات الشك أو التحقق، يحق للمركز إجراء مقابلة قصيرة عبر الفيديو.</li>
      </ol>

      <p><strong>رابعاً: التوثيق والمتابعة:</strong></p>
      <ul>
        <li>يتم حفظ تسجيلات التحقق من الهوية والوثائق ضمن نظام داخلي آمن.</li>
        <li>لا يتم إصدار الشهادات إلا بعد استيفاء جميع خطوات التحقق من الهوية.</li>
      </ul>

      <p class="mt-3"><strong>أُعدّ من قبل:</strong><br>
      فريق الجودة والاعتماد - مركز المسار الصحيح للتدريب<br>
      📧 <a href="mailto:info@righttrack.com.sa">info@righttrack.com.sa</a>
      </p>
    </div>
  `,
  open: false
},
{
  question: "سياسة وآلية النزاهة ومنع انتحال الهوية في بيئة التدريب الإلكتروني",
  answer: `
    <div class="text-end">
      <p><strong>أولاً: أثناء التسجيل في مركز المسار الصحيح للتدريب:</strong></p>
      <ol>
        <li>يُطلب من المتدرب رفع صورة من الهوية الوطنية أو الإقامة عند التسجيل.</li>
        <li>يتم التحقق من مطابقة الاسم والبيانات المدخلة مع الهوية الرسمية.</li>
        <li>لا يتم تفعيل حساب المتدرب حتى يتم اعتماد هويته من قبل الإدارة.</li>
      </ol>

      <p><strong>ثانياً: أثناء حضور البرامج التدريبية:</strong></p>
      <ol>
        <li>يُستخدم بريد إلكتروني رسمي مخصص لكل متدرب لتسجيل الدخول إلى المنصة.</li>
        <li>تُستخدم أنظمة لمتابعة نشاط الدخول والخروج (Logs) داخل المنصة.</li>
        <li>في البرامج التي تتجاوز مدتها 30 يومًا، قد يُطلب توقيع صوتي أو تسجيل فيديو قصير للتأكيد.</li>
      </ol>

      <p><strong>ثالثاً: أثناء التقييمات والاختبارات:</strong></p>
      <ol>
        <li>يُفعل نظام الأسئلة العشوائية مع توقيت زمني محدد.</li>
        <li>بعض التقييمات تتطلب حضورًا عبر Zoom أو Google Meet لمراقبة المتدرب.</li>
        <li>في حالات الشك أو التحقق، يحق للمركز إجراء مقابلة قصيرة عبر الفيديو.</li>
      </ol>

      <p><strong>رابعاً: التوثيق والمتابعة:</strong></p>
      <ul>
        <li>يتم حفظ تسجيلات التحقق من الهوية والوثائق ضمن نظام داخلي آمن.</li>
        <li>لا يتم إصدار الشهادات إلا بعد استيفاء جميع خطوات التحقق من الهوية.</li>
      </ul>

      <p class="mt-3"><strong>أُعدّ من قبل:</strong><br>
      فريق الجودة والاعتماد - مركز المسار الصحيح للتدريب<br>
      📧 <a href="mailto:info@righttrack.com.sa">info@righttrack.com.sa</a>
      </p>
    </div>
  `,
  open: false
},
    { question: "المتطلبات التقنية", answer: `<img src="assets/req.png" alt="Requirements" />`, open: false },
    {
  question: "سياسة آلية الحضور في البرامج التدريبية لدى مركز المسار الصحيح للتدريب",
  answer: `
    <div class="text-end">
      <p>يعتبر الحضور الإلكتروني من أسس نجاح المتعلم عبر التعلم الإلكتروني والتعلم عن بعد، حيث يشير الحضور الإلكتروني المتزامن إلى التواجد افتراضياً للمتدرب المتصل بالإنترنت على المنصة الافتراضية من خلال جهاز حاسوب أو جهاز محمول، وإقرار ما كان المتدرب متواجداً في الوقت الفعلي.</p>

      <p><strong>آليات المتابعة والرصد:</strong></p>
      <ul>
        <li>يتم المتابعة والإشراف والرصد لدخول المتدربين على المنصة الإلكترونية.</li>
        <li>يتم رصد وتسجيل الحضور والغياب الإلكتروني آلياً للمتدربين في المحاضرات عبر أنظمة الفصول الافتراضية.</li>
        <li>يعلم المتدربون بنسب الحضور الإلكتروني على المنصة الافتراضية.</li>
      </ul>

      <p><strong>مقاييس الحضور الإلكتروني:</strong></p>
      <ul>
        <li>الحضور افتراضياً يعادل الحضور الاعتيادي.</li>
        <li>الحد الأدنى من تقديم ساعات الحضور المتزامن لا يقل عن 25 ساعة للبرامج التي تزيد مدتها عن شهر، خاصة في النمط الإلكتروني غير المتزامن أو التعلم المدمج.</li>
        <li>يجب ألا تقل نسبة الحضور الإلكتروني عن 75% من مجموع ساعات المقرر في الفصل الدراسي أو ساعات الدورة أو البرنامج التدريبي.</li>
      </ul>

      <p><strong>إجراءات ضمان الحضور:</strong></p>
      <ul>
        <li>اختيار الوقت المناسب للمتدربين لضمان حضورهم المتزامن وتفاعلهم مع البرنامج التدريبي.</li>
        <li>توفير رابط المنصة التدريبية لجميع المتدربين المسجلين للدورة بوقت كافٍ.</li>
        <li>يسمح بزيادة عدد المتدربين بما يعادل 25% في الفصول الافتراضية المتزامنة بناءً على نوع الدورة التدريبية، نوعية الأنشطة والتفاعل، وخبرة المدرب في تقديم التدريب الإلكتروني.</li>
      </ul>

      <p class="mt-3"><strong>أُعدّ من قبل:</strong><br>
      فريق الجودة والاعتماد - مركز المسار الصحيح للتدريب<br>
      📧 <a href="mailto:info@righttrack.com.sa">info@righttrack.com.sa</a>
      </p>
    </div>
  `,
  open: false
},
{
  question: "سياسة المساعدة والدعم الفني",
  answer: `
    <div class="text-end">
      <p><strong>أولاً: سياسة المساعدة والدعم الفني</strong></p>
      <ul>
        <li>يتم تقديم الدعم الفني والتعليمي عبر عدة قنوات منها:</li>
        <ul>
          <li>الهاتف: ٠١١٧٨٤٣٤٣٣</li>
          <li>البريد الإلكتروني: <a href="mailto:info@righttrack.com.sa">info@righttrack.com.sa</a></li>
          <li>الواتس آب للتواصل مع المدربين: ٠٥٥٢٤٦٨٥٠٠</li>
        </ul>
        <li>الدعم متاح من الأحد إلى الخميس من الساعة 8 صباحاً حتى 5 مساءً.</li>
        <li>متوقع الرد خلال 24 ساعة، وفي حال عدم الرد يمكن التواصل عبر البريد الإلكتروني.</li>
        <li>يجب على المستفيد توضيح المشكلة بالتفصيل والالتزام بآداب الحوار والاحترام، وعدم الإساءة أو الخوض في مناقشات سياسية أو دينية.</li>
      </ul>

      <p><strong>الخدمات التكاملية للدعم الفني:</strong></p>
      <ul>
        <li>حل المشكلات التقنية التي تواجه المستخدمين.</li>
        <li>التدريب على استخدام المنصة الإلكترونية بشكل صحيح.</li>
        <li>مساعدة المستخدمين في إنشاء الحسابات الخاصة بهم.</li>
        <li>مساعدة المتدربين في استخراج الشهادات من منصة منار.</li>
      </ul>

      <p><strong>ثانياً: حقوق الملكية الفكرية في بيئة التعلم الإلكتروني</strong></p>
      <ul>
        <li>يمتلك مركز المسار الصحيح حقوق استخدام المحتوى الإلكتروني المنشور في مواقعه الرسمية.</li>
        <li>يتم احترام حقوق الملكية الفكرية عند تصميم وإعداد الدورات والمواد التعليمية والإعلامية.</li>
        <li>يُلزم المدرب باستخدام المحتوى الخاص بالمركز لأغراض المركز فقط، مع ذكر جميع المراجع والمصادر عند إعداد المحتوى.</li>
        <li>في حال استخدام محتوى مفتوح المصدر، يجب ذكر المصدر.</li>
        <li>يقر المدرب بأن جميع الدورات المرفوعة على المنصة تصبح ملكاً للمركز لاستخدامها لأغراض تطويرية أو تدريبية.</li>
        <li>يُطلب من المدربين والمتدربين الحفاظ على سرية معلومات الدخول وعدم إفشائها.</li>
      </ul>

      <p><strong>ثالثاً: حقوق النشر في بيئة التعلم الإلكتروني</strong></p>
      <ul>
        <li>يُمنع نشر محتوى يتعرض لأشخاص أو مؤسسات بشكل سلبي.</li>
        <li>يُمنع التعدي على حقوق الملكية الفكرية بدون تصريح أو موافقة.</li>
        <li>يُمنع نشر محتوى مخالف للتعاليم الإسلامية أو الأخلاق السائدة.</li>
        <li>يُمنع نشر محتوى يؤثر على الوحدة الوطنية مثل العنصرية أو الطائفية.</li>
        <li>يُمنع الترويج لمحتوى أو منتجات ذات أهداف تجارية ضمن المحتوى التعليمي.</li>
      </ul>

      <p class="mt-3"><strong>أُعدّ من قبل:</strong><br>
      فريق الجودة والاعتماد - مركز المسار الصحيح للتدريب<br>
      📧 <a href="mailto:info@righttrack.com.sa">info@righttrack.com.sa</a>
      </p>
    </div>
  `,
  open: false
},
{
  question: "ما هي سياسة وآداب التواصل في مركز المسار الصحيح للتدريب؟",
  answer: `
    <div class="text-end">
      <p><strong>سياسة التواصل في مركز المسار الصحيح للتدريب</strong></p>
      <p>تقوم سياسة التواصل على ثلاثة محاور أساسية:</p>

      <p><strong>المحور الأول: التواصل الداخلي</strong></p>
      <ul>
        <li>تسهيل التواصل بين أقسام المركز والعاملين لتحقيق انسجام قوي وإجراءات إدارية وتدريبية فعالة.</li>
        <li>أساليب التواصل:</li>
        <ul>
          <li>أجهزة الاتصالات الداخلية بين الأقسام.</li>
          <li>البريد الإلكتروني الداخلي الخاص بالعاملين.</li>
          <li>مجموعات برامج التواصل الاجتماعي (واتس آب).</li>
          <li>الاجتماعات الدورية.</li>
        </ul>
      </ul>

      <p><strong>المحور الثاني: التواصل الخارجي</strong></p>
      <ul>
        <li>التواصل مع المؤسسات الرسمية (الحكومية والقطاع الخاص والمؤسسات غير الربحية) لإنجاز المهمات والحصول على التصاريح.</li>
        <li>وسائل التواصل المعتمدة:</li>
        <ul>
          <li>مواقع الويب الرسمية لتلك الجهات.</li>
          <li>البريد الإلكتروني الرسمي.</li>
          <li>مواقع التواصل الاجتماعي المرتبطة بتلك الجهات.</li>
          <li>أرقام الاتصال المعلنة.</li>
          <li>المكاتبات الورقية عند الحاجة.</li>
        </ul>
      </ul>

      <p><strong>المحور الثالث: التواصل مع المستفيدين</strong></p>
      <ul>
        <li>يُعد تواصل المركز مع المتدرب من أهم وسائل تقييم جودة الخدمات.</li>
        <li>وسائل التواصل:</li>
        <ul>
          <li>الموقع الإلكتروني مع أيقونات اتصال متعددة.</li>
          <li>منتديات النقاش المصاحبة للدورات الغير متزامنة.</li>
          <li>المحادثات المباشرة (الشات) أثناء الدورات.</li>
          <li>حساب المركز على واتس آب متاح على مدار الساعة.</li>
          <li>البريد الإلكتروني الخاص بالمركز.</li>
          <li>حساب المركز على تويتر.</li>
        </ul>
      </ul>

      <p><strong>آداب التواصل في مركز المسار الصحيح للتدريب</strong></p>
      <ul>
        <li><strong>الاحترام:</strong> أساس التواصل الحقيقي، وعدم التقليل من الآخرين مهما اختلفت الآراء.</li>
        <li><strong>التواضع:</strong> يعطي التواصل قيمة ويجنب التكبر الذي يعيق الحوار.</li>
        <li><strong>مراعاة الطرف الآخر:</strong> أخذ حالته النفسية والاجتماعية في الاعتبار.</li>
        <li><strong>حسن الاستماع:</strong> التواصل تبادلي، ويجب الاستماع الجيد للمتحدث والرد المناسب.</li>
      </ul>

      <p><strong>وسائل التواصل الدائم مع المتدرب:</strong></p>
      <ul>
        <li>البريد الإلكتروني: <a href="mailto:info@righttrack.com.sa">info@righttrack.com.sa</a></li>
        <li>الواتس آب: ٠٥٥٢٤٦٨٥٠٠</li>
        <li>وسائل التواصل الاجتماعي</li>
        <li>البث المباشر عبر منصة زوم أثناء التدريب</li>
      </ul>

      <p><strong>تعليمات وآداب التواصل من خلال القنوات المختلفة:</strong></p>
      <ul>
        <li>المشاركة لها علاقة بالتدريب فقط.</li>
        <li>يُمنع الخوض في المعتقدات السياسية أو الدينية أثناء المحاضرات أو التواصل.</li>
        <li>الالتزام بالتواصل والمشاركة الفعالة في قاعة المحاضرة.</li>
        <li>الالتزام بآداب الحديث والاحترام المتبادل بين الجميع.</li>
        <li>احترام فرصة الآخرين للاستفسار والمناقشة دون مقاطعة.</li>
        <li>فتح المايك والكاميرا فقط بإذن من المدرب.</li>
      </ul>

      <p><strong>الإجراءات عند مخالفة آداب التواصل:</strong></p>
      <ul>
        <li>تلقي المخالفات من نظام الشكاوى.</li>
        <li>التواصل مع المخالف كتابياً أو هاتفياً.</li>
        <li>طلب إفادة مكتوبة من المخالف.</li>
        <li>رفع المخالفات لإدارة المنصة مع تصنيفها بسرية.</li>
        <li>دراسة وتحليل المخالفات وفق الأسانيد النظامية.</li>
        <li>رفع توصيات لمجلس الإدارة لاتخاذ الإجراءات اللازمة.</li>
      </ul>
    </div>
  `,
  open: false
}

  ];
  

}
  toggleAnswer(item: any) {
    item.open = !item.open;
  }
}
