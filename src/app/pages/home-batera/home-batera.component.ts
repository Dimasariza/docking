import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-home-batera',
  templateUrl: './home-batera.component.html',
  styleUrls: ['./home-batera.component.scss']
})

export class HomeBateraComponent implements OnInit {
  title = "image-gallery"

  data = [
    {
      imageSrc : 'https://images.unsplash.com/photo-1606185540834-d6e7483ee1a4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      imageAlt : '1',
      shipName : 'Batera Ship 1'
    },
    {
      imageSrc : 'https://images.unsplash.com/photo-1585713181935-d5f622cc2415?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80',
      imageAlt : '2',
      shipName : 'Batera Ship 2'
    },
    {
      imageSrc : 'https://images.unsplash.com/photo-1524522173746-f628baad3644?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1231&q=80',
      imageAlt : '3',
      shipName : 'Batera Ship 3'

    },
    {
      imageSrc : 'https://images.unsplash.com/photo-1530890448995-4d82724f702c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80',
      imageAlt : '4',
      shipName : 'Batera Ship 4'
    },
    {
      imageSrc : 'https://images.unsplash.com/photo-1542986386-660ccbbedaf8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=464&q=80',
      imageAlt : '5',
      shipName : 'Batera Ship 5'
    },
    {
      imageSrc : 'https://images.unsplash.com/photo-1606185540834-d6e7483ee1a4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      imageAlt : '6',
      shipName : 'Batera Ship 6'
    },
  ]

  constructor() { }

  ngOnInit(): void {
  }
}
