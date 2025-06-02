# Rural Business Directory - Data Description

This document outlines the data fields available for the Rural Business Directory application. The data is sourced from a bulk download of Australian business names provided by ASIC (Australian Securities and Investments Commission) via data.gov.au.

**Important Note on File Format:** The source file (`business_names_202505.csv`) uses the **TAB character as the delimiter** (value separator) between values, not commas. This is because business names themselves can contain commas.

## Data Source

The data was downloaded from [data.gov.au](https://data.gov.au).
- **Dataset:** Business Names (ASIC)
- **Download Link:** [business_names_202505.csv](https://data.gov.au/data/dataset/bc515135-4bb6-4d50-957a-3713709a76d3/resource/55ad4b1c-5eeb-44ea-8b29-d410da431be3/download/business_names_202505.csv)
- **Dataset Details:** [https://data.gov.au/dataset/ds-dga-bc515135-4bb6-4d50-957a-3713709a76d3/details?q=business](https://data.gov.au/dataset/ds-dga-bc515135-4bb6-4d50-957a-3713709a76d3/details?q=business)
- **Reference Document:** ASIC Business Names Dataset – Help File (provided separately)

## Available Data Columns

The following columns are available from the source file:

1.  **`REGISTER_NAME`**: Name of the Register as it appears on ASIC's register.
    *   *Data Type: Text*
    *   *Max Length: 200*
    *   *Usage in App: Optional*
2.  **`BN_NAME`**: A name used, or to be used, in relation to one or more businesses. Business Name as it appears on ASIC's Business Names register.
    *   *Data Type: Text*
    *   *Max Length: 200*
    *   *Allowable Characters: A-Z 0-9 . ! ( ) : ; ? ' , - & " = $ % # \ | / _ { } [ ] * @ space*
    *   *Usage in App: Core field, will be displayed prominently.*
3.  **`BN_STATUS`**: Registration Status for the Business Name.
    *   *Data Type: Text*
    *   *Max Length: 12*
    *   *Allowed Values: `Registered`, `Cancelled`*
        *   `Registered`: An organisation that is currently registered by ASIC or another government organisation and is listed on ASIC's registers.
        *   `Cancelled`: A Business Name that has been cancelled by ASIC (whether voluntarily by its holder, or initiated by ASIC). It ceases to exist as a registered business name.
    *   *Usage in App: Important for indicating if a business is currently active. Will be displayed.*
4.  **`BN_REG_DT`**: The date by which the Business Name started.
    *   *Data Type: Date/Time*
    *   *Max Length: 10*
    *   *Format: DD/MM/YYYY*
    *   *Note: All Business Names should have a Date of Registration.*
    *   *Usage in App: Optional, could be displayed for informational purposes.*
5.  **`BN_CANCEL_DT`**: The date by which the Business Name ceased.
    *   *Data Type: Date/Time*
    *   *Max Length: 10*
    *   *Format: DD/MM/YYYY*
    *   *Logic: If Business Name has been cancelled, then shows 'Date of Cancellation', else shows NULL.*
    *   *Usage in App: Optional, relevant if `BN_STATUS` indicates cancellation.*
6.  **`BN_STATE_NUM`**: An identifying number allocated to a business name registered by a previous business names regulator in a particular Australian state or territory of Australia, prior to 28 May 2012.
    *   *Data Type: Text*
    *   *Max Length: 10*
    *   *Logic: If Business Name was registered by the previous Business Names regulator, then shows 'Former State Number', else shows NULL.*
    *   *Usage in App: Optional, primarily for internal use or if specific state codes are needed.*
7.  **`BN_STATE_OF_REG`**: The state the business name was registered in by the previous business names regulator.
    *   *Data Type: Text*
    *   *Max Length: 3*
    *   *Allowed Values: `ACT`, `NSW`, `NT`, `QLD`, `SA`, `TAS`, `VIC`, `WA` (abbreviated notation)*
    *   *Logic: If Business Name was registered by the previous Business Names regulator, then shows 'Previous State of Registration', else shows NULL.*
    *   *Usage in App: Core field, essential for location-based searching and filtering.*
8.  **`BN_ABN`**: The Australian Business Number (ABN). A single identifier for all business dealings with the Australian Taxation Office (ATO) and for dealings with other government departments and agencies.
    *   *Data Type: Text*
    *   *Max Length: 20*
    *   *Logic: If Business Name has an ABN issued from a previous regulator and not recorded with ASIC, then shows NULL. OR If Business Name has more than 1 (multiple) ABN. Suppressed ABNs are shown as NULL.*
    *   *Usage in App: Optional, can be displayed for verification or linking to more detailed ABN lookup services.*

This information, derived from the ASIC Business Names Dataset Help File, will guide the development of the application's data handling, parsing, and display features.

---

## Dataset 2: ABN Bulk Extract

This section describes the ABN Bulk Extract dataset, which provides a snapshot of current ABN details. This dataset is sourced from the Australian Business Register (ABR).

**Important Note on File Format:** This dataset is provided as multiple XML files (e.g., `yyyymmddPublic01.xml` to `yyyymmddPublic20.xml`). Each file contains a `<TransferInfo>` node (with metadata about the file) and multiple `<ABR>` nodes (each representing one ABN record).

### Data Source Details

-   **Provider:** Australian Business Register (ABR)
-   **Available via:** [data.gov.au - ABN Bulk Extract](https://data.gov.au/data/dataset/abn-bulk-extract)
-   **Dataset Title:** ABN Bulk Extract
-   **Description (from data.gov.au):**
    > ABN Lookup Bulk Data - Australian Business Register.
    > The extract information contains a subset of the publicly available information supplied by businesses when they register for an Australian Business Number (ABN). Current details for the following attributes are available:
    >
    > +   ABN
    > +   ABN Status and Date
    > +   Entity Type
    > +   Legal Name
    > +   Business Name(s)
    > +   Trading Name(s)
    > +   State and Postcode of Main Business Location
    > +   ACN/ARBN
    > +   GST Status and Registration Date
    > +   Deductible Gift Recipient Status and Dates
-   **Reference Documents:**
    -   `APIs/ABN-Bulk_Extract/readme-abnbulkextract.pdf` (ABN Lookup Bulk Extract Readme Version 2.6)
    -   `APIs/ABN-Bulk_Extract/schema-bulkextract.xsd` (Bulk Extract XML Schema Definition)
    -   Sample XML: `APIs/ABN-Bulk_Extract/20250528_Public01_sample.xml`

### Key Data Elements (within each `<ABR>` record)

The following are the main data elements available within each `<ABR>` record in the XML files, based on the schema and readme:

1.  **`ABN`** (Element): The Australian Business Number.
    *   *Attributes:* `status` (e.g., `ACT` for Active, `CAN` for Cancelled), `ABNStatusFromDate` (YYYYMMDD format).
    *   *Data Type (Value):* String, 11 digits.
    *   *Usage in App: Core identifier; status is crucial for determining active businesses.*
2.  **`EntityType`** (Element): Describes the type of entity.
    *   Contains:
        *   `EntityTypeInd` (Element): A code representing the entity type (e.g., `PUB` - Australian Public Company, `PRV` - Australian Private Company, `IND` - Individual/Sole Trader). Refer to Appendix B of the readme or `EntityTypeEnum` in the XSD for a full list of codes.
        *   `EntityTypeText` (Element): The full text description of the entity type.
    *   *Usage in App: Provides context about the business's legal structure.*
3.  **`MainEntity` / `LegalEntity`** (Choice Element): Contains name and address details. The choice depends on `EntityTypeInd`.
    *   **`MainEntity`** (used for non-individual entities):
        *   `NonIndividualName` (Element):
            *   `NonIndividualNameText` (Element): The name of the non-individual entity.
            *   *Attribute:* `type` (e.g., `MN` for Main Name).
        *   `BusinessAddress` (Element):
            *   `AddressDetails` (Element):
                *   `State` (Element): State code (e.g., `NSW`, `VIC`).
                *   `Postcode` (Element): Postcode.
    *   **`LegalEntity`** (used if `EntityTypeInd` is `IND` for Individual/Sole Trader):
        *   `IndividualName` (Element):
            *   `NameTitle` (Element, optional): e.g., Mr, Ms, Dr.
            *   `GivenName` (Element, optional, can occur up to 2 times): Given name(s).
            *   `FamilyName` (Element): Family name.
            *   *Attribute:* `type` (e.g., `LGL` for Legal Name).
        *   `BusinessAddress` (Element): (Same structure as in `MainEntity`)
    *   *Usage in App: Provides the primary legal/main name and the main business location's state and postcode.*
4.  **`ASICNumber`** (Element, optional): Australian Company Number (ACN) or Australian Registered Body Number (ARBN).
    *   *Data Type (Value):* String (typically 9 digits for ACN).
    *   *Attribute:* `ASICNumberType` (e.g., `undetermined` in sample, could be `ACN`, `ARBN`).
    *   *Usage in App: Optional identifier, useful for companies.*
5.  **`GST`** (Element, optional): Goods and Services Tax status.
    *   *Attributes:* `status` (e.g., `ACT` for Active, `CAN` for Cancelled, `NON` for Not Registered), `GSTStatusFromDate` (YYYYMMDD format).
    *   *Usage in App: Indicates if the entity is registered for GST and its current GST status.*
6.  **`DGR`** (Element, optional, unbounded - can appear multiple times): Deductible Gift Recipient status and details.
    *   Contains (optional):
        *   `NonIndividualName` (Element): Name of the DGR fund.
            *   `NonIndividualNameText` (Element): The name text.
            *   *Attribute:* `type` (e.g., `DGR`).
    *   *Attributes:* `DGRStatusFromDate` (YYYYMMDD format), `status` (optional, e.g., `ACT`).
    *   *Usage in App: Relevant for identifying non-profits/charities that are DGR endorsed.*
7.  **`OtherEntity`** (Element, optional, unbounded - can appear multiple times): Holds other associated names, such as registered business names and trading names.
    *   Contains:
        *   `NonIndividualName` (Element):
            *   `NonIndividualNameText` (Element): The other name text.
            *   *Attribute:* `type` (e.g., `TRD` for Trading Name, `BN` for Business Name, `OTN` for Other Name).
    *   *Usage in App: Provides additional names under which the entity operates. The `BN` type here can be used to link with the `BN_NAME` from the first (ASIC Business Names) dataset.*
8.  **`@recordLastUpdatedDate`** (Attribute of the `<ABR>` element): The date the ABR record was last updated.
    *   *Format:* YYYYMMDD (represented as an integer in XSD, but typically a date string).
    *   *Usage in App: Indicates the freshness of the data for that specific ABR record.*
9.  **`@replaced`** (Attribute of the `<ABR>` element): Indicates if the record has been replaced (e.g., due to updates).
    *   *Data Type:* String (e.g., `N` for No, `Y` for Yes).
    *   *Usage in App: Important for data synchronization if maintaining a local copy of the bulk extract.*

This ABN Bulk Extract dataset can be used to enrich the information from the Business Names dataset (Dataset 1), particularly by linking records via the ABN. This allows for a more comprehensive view of a business, including its legal entity details, GST status, DGR status, and other associated names.

---

## Dataset 3: ASIC Companies

This section describes the ASIC Companies dataset, which provides information about registered companies in Australia.

**Important Note on File Format:** This dataset is provided as a CSV file (e.g., `company_202505.csv`). It is assumed to be a standard comma-separated values file, likely UTF-8 encoded.

### Data Source Details

-   **Provider:** Australian Securities and Investments Commission (ASIC)
-   **Available via:** [data.gov.au - ASIC Companies](https://data.gov.au/data/dataset/asic-companies/resource/5c3914e6-413e-4a2c-b890-bf8efe3eabf2)
-   **Direct Download Link:** [ASIC Companies CSV](https://data.gov.au/data/datastore/dump/5c3914e6-413e-4a2c-b890-bf8efe3eabf2?bom=True) (Note: The filename in the link is generic; the provided local file is `company_202505.csv`)
-   **Local File Path (example):** `APIs/Company-Dataset/company_202505.csv` (relative to `GitHub/rural-business-directory/`)

### Available Data Columns

The following columns are available from the source CSV file, based on the provided data dictionary:

1.  **`Company Name`**: The name of the company.
    *   *Data Type: Text*
    *   *Usage in App: Primary display name for a company entity.*
2.  **`ACN`**: Australian Company Number.
    *   *Data Type: Text*
    *   *Usage in App: Core identifier for linking with other datasets (e.g., ABN Bulk Extract if ACN is present there) and for unique identification of companies.*
3.  **`Type`**: The type of company (e.g., Proprietary, Public).
    *   *Data Type: Text*
    *   *Usage in App: Categorization of the company.*
4.  **`Class`**: The class of the company (e.g., Limited by Shares, Unlimited with Share Capital).
    *   *Data Type: Text*
    *   *Usage in App: Further categorization of the company's legal structure.*
5.  **`Sub Class`**: The sub-class of the company (e.g., Proprietary Company, Public Company).
    *   *Data Type: Text*
    *   *Usage in App: More specific categorization.*
6.  **`Status`**: The current registration status of the company (e.g., Registered, Deregistered).
    *   *Data Type: Text*
    *   *Usage in App: Crucial for determining if a company is currently active.*
7.  **`Date of Registration`**: The date the company was registered.
    *   *Data Type: Text* (Format likely DD/MM/YYYY or YYYYMMDD)
    *   *Usage in App: Informational.*
8.  **`Date of Deregistration`**: The date the company was deregistered, if applicable.
    *   *Data Type: Text* (Format likely DD/MM/YYYY or YYYYMMDD)
    *   *Usage in App: Informational, relevant if status is Deregistered.*
9.  **`Previous State of Registration`**: If the company was previously registered in a different state.
    *   *Data Type: Text*
    *   *Usage in App: Historical/jurisdictional information.*
10. **`State Registration number`**: The registration number in the previous state, if applicable.
    *   *Data Type: Text*
    *   *Usage in App: Historical/jurisdictional information.*
11. **`Modified since last report`**: Indicator if the record has been modified since the last report.
    *   *Data Type: Text* (Likely Y/N or True/False)
    *   *Usage in App: Useful for data synchronization.*
12. **`Current Name Indicator`**: Indicator if the `Company Name` field represents the current name.
    *   *Data Type: Text* (Likely Y/N or True/False)
    *   *Usage in App: Helps identify the most current name.*
13. **`ABN`**: Australian Business Number associated with the company, if any.
    *   *Data Type: Text*
    *   *Usage in App: Key for linking with the ABN Bulk Extract (Dataset 2) and Business Names (Dataset 1).*
14. **`Current Name`**: The current legal name of the company.
    *   *Data Type: Text*
    *   *Usage in App: Primary display name, potentially more reliable or specific than `Company Name`.*
15. **`Current Name Start Date`**: The date from which the `Current Name` became effective.
    *   *Data Type: Text* (Format likely DD/MM/YYYY or YYYYMMDD)
    *   *Usage in App: Informational, provides context for name changes.*

This ASIC Companies dataset provides detailed information about registered company entities and can be linked with the Business Names and ABN Bulk Extract datasets using ACN and ABN to build a comprehensive profile of businesses.
