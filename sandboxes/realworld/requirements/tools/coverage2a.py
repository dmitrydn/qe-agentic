"""Pinned coverage decisions for the 210-row historical recount (leads only)."""

# Each entry is one checklist row: current source range(s), current BR/AC target(s).
# An ! entry is explicitly excluded from asserted business behaviour with a reason.
COVERAGE = """
B-001|api-response-format.md L7|BR-22.6
B-002|endpoints.md L5-9; openapi.yml L912-922|BR-03.1
B-003|error-handling.md L7|BR-22.1
B-004|error-handling.md L7-17; openapi.yml L637-647|BR-22.1; BR-22.8
B-005|error-handling.md L21|BR-03.3
B-006|error-handling.md L23|BR-22.3
B-007|error-handling.md L25|BR-22.4
B-008|openapi.yml L771-780|BR-22.7
B-009|openapi.yml L791-800|BR-22.8
B-010|openapi.yml L801-810|BR-22.8
B-011|openapi.yml L781-790|BR-01.4; AC-01.3
B-012|cors.md L7|BR-23.1
B-013|cors.md L7|BR-23.1
B-014|cors.md L7|BR-23.1
B-015|backend-tests.md L5|!Engineering delivery requirement, not a Conduit business outcome; no unit-test code or suite was read.
B-016|backend-introduction.md L5|!Overarching implementation conformance directive, not a discrete business outcome; operation contracts are mapped individually below.
U-001|endpoints.md L26|BR-02.2
U-002|endpoints.md L15-24; openapi.yml L822-833|BR-02.7
U-003|endpoints.md L28; openapi.yml L457-459|BR-02.1; AC-02.4
U-004|endpoints.md L28; openapi.yml L457-459|BR-02.1; AC-02.4
U-005|openapi.yml L32-33|BR-02.3; AC-02.2
U-006|openapi.yml L34-37; error-handling.md L7|BR-02.8; OQ-02.1
U-007|openapi.yml L36-37; error-handling.md L7|BR-02.8; BR-22.1
U-008|openapi.yml L481-503|BR-01.8
U-009|openapi.yml L496-503|BR-01.8
U-010|endpoints.md L46|BR-01.2
U-011|endpoints.md L34-44; openapi.yml L834-845|BR-01.9
U-012|endpoints.md L48; openapi.yml L467-471|BR-01.1; AC-01.4
U-013|endpoints.md L48; openapi.yml L467-471|BR-01.1; AC-01.4
U-014|endpoints.md L48; openapi.yml L467-471|BR-01.1; AC-01.4
U-015|openapi.yml L48-49|BR-01.3
U-016|openapi.yml L50-51; openapi.yml L781-790|BR-01.4
U-017|openapi.yml L52-53; error-handling.md L7|BR-01.5; BR-22.1
U-018|endpoints.md L54|BR-03.2
U-019|openapi.yml L63-64|BR-03.5
U-020|openapi.yml L65-66|BR-03.3
U-021|endpoints.md L72|BR-05.3
U-022|endpoints.md L74|BR-05.3
U-023|endpoints.md L74|BR-05.3
U-024|endpoints.md L74|BR-05.3
U-025|endpoints.md L74|BR-05.3
U-026|endpoints.md L74|BR-05.3
U-027|openapi.yml L80-81; endpoints.md L72|BR-05.6
U-028|openapi.yml L846-857|BR-05.5
U-029|openapi.yml L82-83|BR-05.6; BR-22.2
U-030|openapi.yml L84-85; error-handling.md L7|BR-05.6; BR-22.1
U-031|routing.md L10; features.md L7|BR-01.7; BR-03.1
P-001|endpoints.md L80|BR-06.2
P-002|openapi.yml L521-540; openapi.yml L746-756|BR-06.5
P-003|api-response-format.md L25-33; openapi.yml L539-540|!Viewer-relative following meaning is inferred, not stated. BR-19.2 became OQ-19.4; field presence/type is BR-06.5, not a proof of semantics.
P-004|openapi.yml L108-109|BR-06.3
P-005|endpoints.md L86|BR-19.1
P-006|endpoints.md L88|BR-19.6
P-007|openapi.yml L127-128|BR-19.6
P-008|openapi.yml L131-132|BR-19.4
P-009|openapi.yml L129-130; error-handling.md L21|BR-19.6; BR-22.2
P-010|endpoints.md L94|BR-19.1
P-011|endpoints.md L96|BR-19.6
P-012|openapi.yml L151-152|BR-19.6
P-013|openapi.yml L155-156|BR-19.6; BR-22.4
P-014|openapi.yml L153-154; error-handling.md L21|BR-19.6; BR-22.2
P-015|openapi.yml L110-111; openapi.yml L133-134; openapi.yml L157-158|BR-06.6; BR-19.6; BR-22.1
P-016|openapi.yml L106-107|BR-06.6; OQ-03.4
A-001|endpoints.md L126|BR-12.2
A-002|endpoints.md L102; endpoints.md L126|BR-12.2
A-003|endpoints.md L106-108|BR-14.2; AC-14.3
A-004|endpoints.md L110-112|BR-07.2; AC-07.3
A-005|endpoints.md L114-116|BR-07.2; AC-07.4
A-006|endpoints.md L118-120|BR-15.2; AC-15.3
A-007|endpoints.md L118; openapi.yml L910|BR-15.2
A-008|openapi.yml L903-911|BR-15.5
A-009|endpoints.md L122-124|BR-15.2; AC-15.3
A-010|endpoints.md L122|BR-15.2
A-011|openapi.yml L895-902|BR-15.5
A-012|openapi.yml L697-745|BR-12.5
A-013|api-response-format.md L62-67|BR-12.3
A-014|openapi.yml L710-743|BR-12.5
A-015|openapi.yml L702-745|BR-12.5
A-016|openapi.yml L212-213; error-handling.md L7|BR-12.6; BR-22.1
A-017|openapi.yml L210-211|BR-12.6; OQ-03.4
A-018|endpoints.md L134|BR-13.2
A-019|endpoints.md L132|BR-13.3
A-020|endpoints.md L132|BR-13.3
A-021|endpoints.md L134|BR-13.2
A-022|endpoints.md L134|BR-13.2
A-023|api-response-format.md L62-67|BR-12.3
A-024|openapi.yml L175-176|BR-13.4; AC-13.4
A-025|endpoints.md L140|BR-11.2
A-026|openapi.yml L249-250; endpoints.md L140|BR-11.6
A-027|api-response-format.md L38-57; openapi.yml L541-578|BR-08.5; BR-08.8
A-028|openapi.yml L251-252|BR-11.5
A-029|endpoints.md L159|BR-08.3
A-030|endpoints.md L148-157; openapi.yml L858-869|BR-08.7
A-031|endpoints.md L161|BR-08.4
A-032|endpoints.md L161|BR-08.4
A-033|endpoints.md L161|BR-08.4
A-034|endpoints.md L163; openapi.yml L592-595|BR-08.7
A-035|openapi.yml L223-224|BR-08.5
A-036|openapi.yml L225-226; error-handling.md L21|BR-08.9; AC-08.5
A-037|openapi.yml L227-228|BR-08.9; OQ-08.1
A-038|openapi.yml L229-230; error-handling.md L7|BR-08.9; BR-22.1
A-039|endpoints.md L179|BR-09.2
A-040|endpoints.md L181|BR-09.2
A-041|endpoints.md L181|BR-09.2
A-042|endpoints.md L181|BR-09.2
A-043|endpoints.md L181; openapi.yml L596-608|!Prose omits tagList while UpdateArticle schema includes it; OQ-09.1 retains both sources. No business decision or new assertion about editable tags.
A-044|endpoints.md L183|BR-09.3
A-045|openapi.yml L271-272; endpoints.md L179|BR-09.5
A-046|openapi.yml L273-274; error-handling.md L21|BR-09.5; BR-22.2
A-047|openapi.yml L275-276; error-handling.md L23|BR-09.5; BR-22.3
A-048|openapi.yml L277-278; error-handling.md L25|BR-09.5; BR-22.4
A-049|openapi.yml L279-280; error-handling.md L7|BR-09.5; BR-22.1
A-050|endpoints.md L187-191|BR-10.1
A-051|openapi.yml L298-299; openapi.yml L768-770|BR-10.4
A-052|openapi.yml L300-301; error-handling.md L21|BR-10.4; BR-22.2
A-053|openapi.yml L302-303; error-handling.md L23|BR-10.4; BR-22.3
A-054|openapi.yml L304-305; error-handling.md L25|BR-10.4; BR-22.4
A-055|openapi.yml L306-307; error-handling.md L7|BR-10.4; BR-22.1
A-056|openapi.yml L567-572|BR-08.8
A-057|openapi.yml L575-576|BR-08.8
A-058|openapi.yml L577-578|BR-08.8
C-001|endpoints.md L207|BR-16.2
C-002|endpoints.md L197-205; openapi.yml L882-893|BR-16.4
C-003|endpoints.md L209; openapi.yml L630-636|BR-16.2
C-004|openapi.yml L349-350|BR-16.2
C-005|openapi.yml L351-352; error-handling.md L21|BR-16.6; AC-16.4
C-006|openapi.yml L353-354; error-handling.md L25|BR-16.6; BR-22.4
C-007|openapi.yml L355-356; error-handling.md L7|BR-16.6; BR-22.1
C-008|endpoints.md L215|BR-17.1
C-009|openapi.yml L325-326; api-response-format.md L127-141|BR-17.4
C-010|openapi.yml L329-330; error-handling.md L25|BR-17.4; BR-22.4
C-011|openapi.yml L609-629|BR-16.5
C-012|openapi.yml L618-619|BR-16.5
C-013|endpoints.md L217-221|BR-18.1
C-014|openapi.yml L381-382; openapi.yml L768-770|BR-18.4
C-015|openapi.yml L383-384; error-handling.md L21|BR-18.4; BR-22.2
C-016|openapi.yml L385-386; error-handling.md L23|BR-18.4; BR-22.3
C-017|openapi.yml L387-388; error-handling.md L25|BR-18.4; BR-22.4
C-018|openapi.yml L389-390; error-handling.md L7|BR-18.4; BR-22.1
C-019|openapi.yml L374-379|BR-18.4
F-001|endpoints.md L227|BR-20.1
F-002|endpoints.md L229|BR-20.5
F-003|openapi.yml L408-409|BR-20.5
F-004|openapi.yml L410-411; error-handling.md L21|BR-20.5; BR-22.2
F-005|openapi.yml L412-413; error-handling.md L25|BR-20.5; BR-22.4
F-006|endpoints.md L235|BR-20.1
F-007|endpoints.md L237|BR-20.5
F-008|openapi.yml L432-433|BR-20.5
F-009|openapi.yml L434-435; error-handling.md L21|BR-20.5; BR-22.2
F-010|openapi.yml L436-437; error-handling.md L25|BR-20.5; BR-22.4
F-011|api-response-format.md L48-49; endpoints.md L223-237|!The recount explicitly labels the state/count transition implied; not a stated expected result. See OQ-20.3 and retained BA-ASSUMPTION scenarios.
F-012|endpoints.md L243|BR-14.3
F-013|openapi.yml L450-451; api-response-format.md L146-152|BR-14.4
F-014|openapi.yml L452-453|BR-14.4
FE-001|routing.md L5|BR-12.1
FE-002|routing.md L6|BR-14.1
FE-003|routing.md L7|BR-12.2; BR-13.2; BR-14.2
FE-004|routing.md L8|BR-15.1
FE-005|templates.md L120|BR-12.1
FE-006|templates.md L121|BR-14.2
FE-007|templates.md L122|BR-13.1
FE-008|templates.md L126-131|BR-12.7
FE-009|templates.md L203|BR-14.1
FE-010|templates.md L191-196|BR-15.6
FE-011|templates.md L145-185|BR-12.4
FE-012|routing.md L9|BR-02.5
FE-013|routing.md L9|BR-01.6
FE-014|routing.md L10|BR-01.7
FE-015|templates.md L231-247|BR-02.5; BR-02.9
FE-016|templates.md L262-281|BR-01.6; BR-01.10
FE-017|templates.md L236-238; templates.md L267-269|BR-01.6; BR-02.5
FE-018|routing.md L12|BR-05.1
FE-019|templates.md L404-426|BR-05.2
FE-020|templates.md L430; features.md L7|BR-04.1
FE-021|routing.md L13|BR-08.1
FE-022|routing.md L13|BR-09.1
FE-023|templates.md L451-470|BR-08.2
FE-024|templates.md L464-466|BR-08.10
FE-025|templates.md L444-446|BR-08.10
FE-026|routing.md L14|BR-11.1
FE-027|routing.md L15|BR-10.2
FE-028|routing.md L16|BR-11.3
FE-029|routing.md L17|BR-11.4
FE-030|routing.md L18|BR-18.2
FE-031|templates.md L482; templates.md L495-509|BR-19.3; BR-20.3; BR-10.2; OQ-09.2
FE-032|templates.md L562-566|BR-16.1
FE-033|templates.md L577-582|BR-17.2
FE-034|routing.md L19|BR-06.1
FE-035|routing.md L19|BR-07.1
FE-036|routing.md L20|BR-06.1
FE-037|routing.md L21|BR-07.1
FE-038|templates.md L322-325|BR-07.1
FE-039|templates.md L305-309|BR-06.4
FE-040|templates.md L36-40|BR-21.1
FE-041|templates.md L66-71|BR-21.2
FE-042|templates.md L42; templates.md L73|BR-21.3
FE-043|templates.md L103-111|BR-21.4
FE-044|templates.md L14|BR-21.4
FE-045|styles.md L5-14; templates.md L7-26|!Stylesheet packaging/theme-class choice is styling/implementation scope, not a new business rule. Current sources agree; old theme-CDN conflict is resolved. No asset was fetched.
FE-046|styles.md L16-18|BR-21.5
FE-047|frontend-tests.md L11-19|!Automation compatibility contract outside business requirements. Its oracle-directory target was never opened; no selector values or debug interface were inferred.
FE-048|frontend-tests.md L5|!Engineering delivery/unit-test requirement, not business behaviour; no tests opened.
FE-049|frontend-api.md L25-34|!Hosted-demo deployment limitation, not universal Conduit behaviour. Do not copy its visibility restriction into product requirements; no hosted API queried.
FT-001|features.md L7; routing.md L9-10|BR-01.6; BR-01.7; BR-02.5; BR-03.1
FT-002|features.md L8|BR-01.1; BR-05.3; BR-05.4; BR-03.2
FT-003|features.md L9|BR-08.3; BR-09.2; BR-10.1; BR-11.2
FT-004|features.md L10|BR-16.2; BR-16.3; BR-17.1; BR-18.1
FT-005|features.md L11|BR-15.1; BR-15.2
FT-006|features.md L12|BR-20.1
FT-007|features.md L13|BR-19.1
"""

# These explanations prevent a code declaration from being mistaken for a decided trigger.
NOTES = {
    "U-006": "Only the 401 declaration is covered, not a selected wrong-password predicate; OQ-02.1 is still Open.",
    "P-015": "422 declarations plus generic validation rule; specific invalid-input boundaries remain X-06 questions.",
    "P-016": "Declared 401 only; optional authentication is retained and invalid-token classification is OQ-03.4.",
    "A-017": "Declared 401 only; no rule rejecting ordinary anonymous listing was added.",
    "A-037": "409 declaration covered; conflict trigger remains OQ-08.1; unique duplicate-title slugs remain BR-08.6.",
    "FE-031": "Existing Follow/Favorite/Delete controls covered; edit control presence is added in BR-08.10, but switching logic remains OQ-09.2. No API ownership condition is inferred.",
    "A-015": "Required integer presence only; filtered-total meaning remains OQ-15.3.",
}