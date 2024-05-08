import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: "Hydrogen", weight: 1.0079, symbol: "H" },
  { position: 2, name: "Helium", weight: 4.0026, symbol: "He" },
  { position: 3, name: "Lithium", weight: 6.941, symbol: "Li" },
  { position: 4, name: "Beryllium", weight: 9.0122, symbol: "Be" },
  { position: 5, name: "Boron", weight: 10.811, symbol: "B" },
  { position: 6, name: "Carbon", weight: 12.0107, symbol: "C" },
  { position: 7, name: "Nitrogen", weight: 14.0067, symbol: "N" },
  { position: 8, name: "Oxygen", weight: 15.9994, symbol: "O" },
  { position: 9, name: "Fluorine", weight: 18.9984, symbol: "F" },
  { position: 10, name: "Neon", weight: 20.1797, symbol: "Ne" },
];

@Component({
  selector: "ngx-objectives",
  templateUrl: "./objectives.component.html",
  styleUrls: ["./objectives.component.scss"],
})
export class ObjectivesComponent implements OnInit {
  displayedColumns: string[] = ["position", "name", "weight", "symbol"];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  constructor() {}

  ngOnInit(): void {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

/*
   {
        "_id": "6639bb085ac4e9dc270d5478",
        "id": "ef0edb85-5c4d-496c-9d51-7890b1cf208f",
        "email": "jeeps@chmsu.edu.ph",
        "username": "jeeps",
        "role": "user",
        "status": "active"
    },
    {
        "_id": "66399d49a645be83b29df38d",
        "id": "8c7ba283-4390-4d45-bc78-fdda284cc617",
        "email": "testerx@chmsu.edu.ph",
        "username": "testerx",
        "role": "user",
        "status": "active"
    },

*/
