# CHP Statement Tools by UrbanJakubDev

**CHP Statement Tools** (formerly GVE) is a comprehensive utility for generating and processing energy reports for **ERU** (Energy Regulatory Office) and **OTE** (Market Operator).

The application simplifies the conversion of data from Excel files into the specific XML/JSON formats required by these authorities, minimizing manual errors and saving time.

## Features

### ⚡ ERU (Energetický regulační úřad)
- **ERU-E1**: Generator for monthly electricity production and consumption reports.
- **ERU-T1**: Generator for monthly heat production and consumption reports.

### 📉 OTE (Operátor trhu s elektřinou)
- **Data Download & Processing**:
    - **Request Generator**: Converts your XLSX data (with columns `source-id`, `ean`, `date-from`, `date-to`) into a valid `xml-req.xml` request file for OTE.
    - **Response Processor**: Parses the OTE XML response, automatically sums up Supply (A11) and Consumption (A12) values per EAN, and exports the results to an XLSX file.

## Usage

### OTE Data Download
1.  Navigate to the **OTE** section from the main dashboard.
2.  Select **"Stahování Dat"**.
3.  **Generate Request**:
    -   Upload your Excel file containing the required columns.
    -   Click "Generovat XML Request" to download the XML file.
4.  **Process Response**:
    -   Upload the XML response file received from OTE.
    -   Click "Zpracovat a Stáhnout XLSX" to get the summed data.

## Installation

Install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
