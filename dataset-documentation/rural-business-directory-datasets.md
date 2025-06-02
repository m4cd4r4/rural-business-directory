
# 📊 Rural Business Directory – Data Description

This document outlines the datasets and data fields used in the **Rural Business Directory** application. It includes details on file formats, sources, and column definitions to support accurate data integration and application logic.

---

## 📂 Dataset 1: ASIC Business Names

### Overview

- **Source:** [ASIC Business Names](https://data.gov.au/dataset/bc515135-4bb6-4d50-957a-3713709a76d3/details?q=business)
- **Download:** [business_names_202505.csv](https://data.gov.au/data/dataset/bc515135-4bb6-4d50-957a-3713709a76d3/resource/55ad4b1c-5eeb-44ea-8b29-d410da431be3/download/business_names_202505.csv)
- **File Format:** CSV (TAB-delimited)
- **Reference:** ASIC Business Names Dataset – Help File

> **Note:** The source file uses a **TAB** delimiter, not commas, as business names may contain commas.

### Available Columns

| Column Name       | Description                                                        | Data Type | Format / Notes                                                                                     |
|-------------------|--------------------------------------------------------------------|-----------|----------------------------------------------------------------------------------------------------|
| `REGISTER_NAME`    | Register name (ASIC)                                              | Text      | Max 200 chars. Optional.                                                                            |
| `BN_NAME`          | Business name                                                     | Text      | Core field. A-Z, 0-9, symbols. Max 200 chars.                                                       |
| `BN_STATUS`        | Registration status (`Registered`, `Cancelled`)                   | Text      | Max 12 chars. Essential for active/inactive filtering.                                              |
| `BN_REG_DT`        | Date of registration                                             | Date      | Format: `DD/MM/YYYY`. Optional.                                                                     |
| `BN_CANCEL_DT`     | Date of cancellation                                             | Date      | Format: `DD/MM/YYYY`. Optional, relevant if cancelled.                                              |
| `BN_STATE_NUM`     | Legacy state registration number                                 | Text      | Max 10 chars. Optional, for legacy records only.                                                    |
| `BN_STATE_OF_REG`  | State of registration (`ACT`, `NSW`, etc.)                       | Text      | Max 3 chars. Core field for location filtering.                                                     |
| `BN_ABN`           | Australian Business Number                                       | Text      | Max 20 chars. May be null. Useful for linking to ABN datasets.                                      |

---

## 📂 Dataset 2: ABN Bulk Extract

### Overview

- **Source:** [ABN Bulk Extract (data.gov.au)](https://data.gov.au/data/dataset/abn-bulk-extract)
- **File Format:** XML (`yyyymmddPublic01.xml` to `yyyymmddPublic20.xml`)
- **Reference Docs:**  
  - [Readme (PDF)](APIs/ABN-Bulk_Extract/readme-abnbulkextract.pdf)  
  - [Schema (XSD)](APIs/ABN-Bulk_Extract/schema-bulkextract.xsd)  
  - Sample: `APIs/ABN-Bulk_Extract/20250528_Public01_sample.xml`

### Key Data Elements

| Element           | Description                                                          | Notes                                                                                  |
|-------------------|----------------------------------------------------------------------|----------------------------------------------------------------------------------------|
| `ABN`             | Australian Business Number (11 digits)                               | Attributes: `status` (e.g., `ACT`), `ABNStatusFromDate` (YYYYMMDD).                     |
| `EntityType`      | Entity classification                                                | Codes (e.g., `PUB`, `PRV`). Full text in `EntityTypeText`.                             |
| `MainEntity` / `LegalEntity` | Name and address details for entity                    | Depends on entity type. Includes names, address, state, postcode.                      |
| `ASICNumber`      | ACN or ARBN (if applicable)                                          | Optional. May include type (ACN/ARBN).                                                |
| `GST`             | GST registration status                                              | Attributes: `status`, `GSTStatusFromDate`.                                             |
| `DGR`             | Deductible Gift Recipient details                                    | Optional. Includes name, status, and start date.                                        |
| `OtherEntity`     | Additional names (e.g., trading names)                               | Optional. Includes type (TRD, BN, OTN).                                                |
| `@recordLastUpdatedDate` | Date the record was last updated                             | Format: YYYYMMDD.                                                                      |
| `@replaced`       | Record replacement indicator (`Y`/`N`)                               | Indicates if record was superseded.                                                     |

---

## 📂 Dataset 3: ASIC Companies

### Overview

- **Source:** [ASIC Companies](https://data.gov.au/data/dataset/asic-companies/resource/5c3914e6-413e-4a2c-b890-bf8efe3eabf2)
- **Download:** [ASIC Companies CSV](https://data.gov.au/data/datastore/dump/5c3914e6-413e-4a2c-b890-bf8efe3eabf2?bom=True)
- **File Format:** CSV (comma-delimited, UTF-8)
- **Reference:** Local file: `APIs/Company-Dataset/company_202505.csv`

### Available Columns

| Column Name                  | Description                                               | Notes                                                   |
|-----------------------------|-----------------------------------------------------------|---------------------------------------------------------|
| `Company Name`              | Registered company name                                   | Primary display name.                                   |
| `ACN`                       | Australian Company Number                                 | Core identifier for linking with other datasets.        |
| `Type`                      | Company type (e.g., Proprietary, Public)                  |                                                         |
| `Class`                     | Company class (e.g., Limited by Shares)                   |                                                         |
| `Sub Class`                 | Sub-category of company type                              |                                                         |
| `Status`                    | Registration status (e.g., Registered, Deregistered)       | Indicates active/inactive status.                       |
| `Date of Registration`      | Company registration date                                 | Format: DD/MM/YYYY or YYYYMMDD.                         |
| `Date of Deregistration`    | Deregistration date (if applicable)                        | Format: DD/MM/YYYY or YYYYMMDD.                         |
| `Previous State of Registration` | Previous state of registration                          | Historical data.                                        |
| `State Registration number` | Legacy state registration number                          | Historical data.                                        |
| `Modified since last report` | Record modification indicator                             | Y/N or True/False.                                      |
| `Current Name Indicator`    | Indicates if name is current                              | Y/N or True/False.                                      |
| `ABN`                       | Australian Business Number                                 | Links to ABN dataset.                                   |
| `Current Name`              | Current legal name of company                             | May differ from `Company Name`.                         |
| `Current Name Start Date`   | Date the current name became effective                     | Informational.                                          |

---

### 🔗 Cross-Dataset Linking

The datasets can be linked as follows:
- **BN_ABN** (from Business Names) → **ABN** (in ABN Bulk Extract)
- **ACN** (in ASIC Companies) → **ASICNumber** (in ABN Bulk Extract)
- **BN_NAME** (in Business Names) ↔ **OtherEntity/NonIndividualNameText** (in ABN Bulk Extract)

This enables a unified view of Australian businesses, their legal structures, registration details, and operational statuses.
